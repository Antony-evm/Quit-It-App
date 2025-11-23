import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '@/shared/auth';
import AuthService from '@/shared/auth/authService';
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
  const { isLoading: authLoading, refreshAuthState } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const stytch = useStytch();
  const [isInitializing, setIsInitializing] = useState(true);

  const handleStartupNavigation = useCallback(async () => {
    try {
      setIsInitializing(true);
      console.log('[StartupNavigation] Starting authentication check...');

      // Check authentication status with token validation
      const authResult = await AuthService.checkAuthenticationWithValidation(
        stytch,
      );

      console.log('[StartupNavigation] Auth check result:', {
        isAuthenticated: authResult.isAuthenticated,
        isSessionValid: authResult.isSessionValid,
        hasUser: !!authResult.user,
        userStatusId: authResult.user?.userStatusId,
      });

      // Case 1: No tokens found - navigate to signup
      if (!authResult.isAuthenticated) {
        console.log(
          '[StartupNavigation] No tokens found, navigating to Auth (signup)',
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth', params: { mode: 'signup' } }],
        });
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth', params: { mode: 'login' } }],
        });
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
          navigation.reset({
            index: 0,
            routes: [{ name: 'Questionnaire' }],
          });
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'Questionnaire' }],
            });
            return;
          }

          // Navigate based on action type using reset for clean navigation stack
          switch (action.type) {
            case USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE:
              navigation.reset({
                index: 0,
                routes: [{ name: 'Questionnaire' }],
              });
              break;
            case USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL:
              navigation.reset({
                index: 0,
                routes: [{ name: 'Paywall' }],
              });
              break;
            case USER_STATUS_ACTIONS.NAVIGATE_TO_HOME:
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
              break;
            case USER_STATUS_ACTIONS.PLACEHOLDER_CALL:
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
              break;
            default:
              console.warn(
                '[StartupNavigation] Unknown action type, navigating to questionnaire',
              );
              navigation.reset({
                index: 0,
                routes: [{ name: 'Questionnaire' }],
              });
          }
        } catch (statusError) {
          console.error(
            '[StartupNavigation] Failed to initialize UserStatusService:',
            statusError,
          );
          // Fallback to questionnaire if status service fails
          navigation.reset({
            index: 0,
            routes: [{ name: 'Questionnaire' }],
          });
        }
      }
    } catch (error) {
      console.error('[StartupNavigation] Startup navigation error:', error);
      // Fallback to auth screen on any error
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } finally {
      setIsInitializing(false);
    }
  }, [navigation, stytch, refreshAuthState]);

  useEffect(() => {
    // Only run startup navigation when auth is not loading
    if (!authLoading) {
      handleStartupNavigation();
    }
  }, [authLoading, handleStartupNavigation]);

  // Don't render children until startup navigation is complete
  if (authLoading || isInitializing) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
