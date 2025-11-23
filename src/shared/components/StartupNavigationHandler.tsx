import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '@/shared/auth';
import AuthService from '@/shared/auth/authService';
import { bootstrapAuthState } from '@/shared/auth/authBootstrap';
import { useNavigationReady } from '@/navigation/NavigationContext';
import { UserStatusService } from '@/shared/services/userStatusService';
import { USER_STATUS_ACTIONS } from '@/shared/constants/userStatus';
import { LoadingScreen } from './LoadingScreen';
import type { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface StartupNavigationHandlerProps {
  children: React.ReactNode;
}

/**
 * Component that handles startup navigation logic based on authentication state and token validation
 */
export const StartupNavigationHandler: React.FC<
  StartupNavigationHandlerProps
> = ({ children }) => {
  // ALL HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME
  const { initializeFromBootstrap, refreshAuthState } = useAuth();
  const { isReady: isNavReady } = useNavigationReady();
  const navigation = useNavigation<NavigationProp>();
  const stytch = useStytch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Safe navigation helper
  const safeNavigate = useCallback(
    (routeName: keyof RootStackParamList, params?: any) => {
      try {
        if (!isNavReady) {
          console.warn('[StartupNavigation] Navigation not ready yet');
          return false;
        }

        console.log(
          '[StartupNavigation] Navigating to:',
          routeName,
          params ? `with params: ${JSON.stringify(params)}` : '',
        );

        // Check if navigation object has the reset method
        if (!navigation || typeof navigation.reset !== 'function') {
          console.error('[StartupNavigation] Navigation object not ready');
          return false;
        }

        navigation.reset({
          index: 0,
          routes: [{ name: routeName, ...(params && { params }) }],
        });
        return true;
      } catch (error) {
        console.error('[StartupNavigation] Navigation error:', error);
        return false;
      }
    },
    [navigation, isNavReady],
  );

  const handleStartupNavigation = useCallback(async () => {
    if (hasNavigated) return;

    try {
      setHasNavigated(true);
      console.log('[StartupNavigation] Starting authentication check...');

      const authResult = await bootstrapAuthState(stytch);

      console.log('[StartupNavigation] Auth check result:', {
        isAuthenticated: authResult.isAuthenticated,
        isSessionValid: authResult.isSessionValid,
        hasUser: !!authResult.user,
        userStatusId: authResult.user?.userStatusId,
      });

      initializeFromBootstrap({
        tokens: authResult.tokens,
        user: authResult.user,
      });

      // Case 1: No tokens found - navigate to signup
      if (!authResult.isAuthenticated) {
        console.log(
          '[StartupNavigation] No tokens found, navigating to Auth (signup)',
        );

        if (!safeNavigate('Auth', { mode: 'signup' })) {
          return; // Navigation failed, exit early
        }
        return;
      }

      // Case 2: Tokens exist but are invalid - navigate to login
      if (authResult.isAuthenticated && !authResult.isSessionValid) {
        console.log(
          '[StartupNavigation] Invalid tokens found, clearing and navigating to Auth (login)',
        );

        // Clear invalid tokens
        await AuthService.clearAuth();
        await refreshAuthState();

        if (!safeNavigate('Auth', { mode: 'login' })) {
          return; // Navigation failed, exit early
        }
        return;
      }

      // Case 3: Valid tokens - navigate based on user status
      if (
        authResult.isAuthenticated &&
        authResult.isSessionValid &&
        authResult.user
      ) {
        console.log(
          '[StartupNavigation] Valid tokens found, navigating based on user status...',
        );

        const userStatusId = authResult.user.userStatusId;

        if (!userStatusId) {
          console.warn(
            '[StartupNavigation] No user status ID found, navigating to questionnaire',
          );
          safeNavigate('Questionnaire');
          return;
        }

        // Initialize user status service if needed
        try {
          if (!UserStatusService.getStatus(userStatusId)) {
            console.log(
              '[StartupNavigation] Initializing UserStatusService...',
            );
            await UserStatusService.initialize();
          }

          // Execute navigation based on user status
          console.log(
            '[StartupNavigation] Executing status-based navigation for status:',
            userStatusId,
          );

          // Get the action to determine the navigation target
          const action = UserStatusService.getStatusAction(userStatusId);

          if (!action) {
            console.warn(
              '[StartupNavigation] No action found for status, navigating to questionnaire',
            );
            safeNavigate('Questionnaire');
            return;
          }

          // Navigate based on action type using reset for clean navigation stack
          switch (action.type) {
            case USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE:
              safeNavigate('Questionnaire');
              break;
            case USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL:
              safeNavigate('Paywall');
              break;
            case USER_STATUS_ACTIONS.NAVIGATE_TO_HOME:
              safeNavigate('Home');
              break;
            case USER_STATUS_ACTIONS.PLACEHOLDER_CALL:
              safeNavigate('Home');
              break;
            default:
              console.warn(
                '[StartupNavigation] Unknown action type, navigating to questionnaire',
              );
              safeNavigate('Questionnaire');
          }
        } catch (statusError) {
          console.error(
            '[StartupNavigation] Failed to initialize UserStatusService:',
            statusError,
          );
          // Fallback to questionnaire if status service fails
          safeNavigate('Questionnaire');
        }
      }
    } catch (error) {
      console.error('[StartupNavigation] Startup navigation error:', error);
      // Fallback to auth screen on any error
      safeNavigate('Auth');
    } finally {
      setIsInitializing(false);
    }
  }, [stytch, refreshAuthState, safeNavigate, hasNavigated, initializeFromBootstrap]);

  useEffect(() => {
    if (!hasNavigated) {
      const timer = setTimeout(handleStartupNavigation, 100);
      return () => clearTimeout(timer);
    }
  }, [hasNavigated, handleStartupNavigation]);

  // Don't render children until startup navigation is complete
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
