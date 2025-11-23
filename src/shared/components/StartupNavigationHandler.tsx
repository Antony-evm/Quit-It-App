import React, { useEffect, useState, useCallback } from 'react';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '@/shared/auth';
import AuthService from '@/shared/auth/authService';
import { bootstrapAuthState } from '@/shared/auth/authBootstrap';
import { useNavigationReady } from '@/navigation/NavigationContext';
import { resetNavigation } from '@/navigation/navigationRef';
import { UserStatusService } from '@/shared/services/userStatusService';
import { USER_STATUS_ACTIONS } from '@/shared/constants/userStatus';
import { LoadingScreen } from './LoadingScreen';
import type { RootStackParamList } from '@/types/navigation';

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
  const stytch = useStytch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<{
    route: keyof RootStackParamList;
    params?: any;
  } | null>(null);
  const [navigationAttempt, setNavigationAttempt] = useState(0);

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

        return resetNavigation(routeName, params);
      } catch (error) {
        console.error('[StartupNavigation] Navigation error:', error);
        return false;
      }
    },
    [isNavReady],
  );

  const handleStartupNavigation = useCallback(async () => {
    if (bootstrapDone) return;

    try {
      setBootstrapDone(true);
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
        console.log('[StartupNavigation] No tokens found, enqueue Auth signup');
        setPendingRoute({ route: 'Auth', params: { mode: 'signup' } });
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

        setPendingRoute({ route: 'Auth', params: { mode: 'login' } });
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
          setPendingRoute({ route: 'Questionnaire' });
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
            setPendingRoute({ route: 'Questionnaire' });
            return;
          }

          // Navigate based on action type using reset for clean navigation stack
          switch (action.type) {
            case USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE:
              setPendingRoute({ route: 'Questionnaire' });
              break;
            case USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL:
              setPendingRoute({ route: 'Paywall' });
              break;
            case USER_STATUS_ACTIONS.NAVIGATE_TO_HOME:
              setPendingRoute({ route: 'Home' });
              break;
            case USER_STATUS_ACTIONS.PLACEHOLDER_CALL:
              setPendingRoute({ route: 'Home' });
              break;
            default:
              console.warn(
                '[StartupNavigation] Unknown action type, navigating to questionnaire',
              );
              setPendingRoute({ route: 'Questionnaire' });
          }
        } catch (statusError) {
          console.error(
            '[StartupNavigation] Failed to initialize UserStatusService:',
            statusError,
          );
          // Fallback to questionnaire if status service fails
          setPendingRoute({ route: 'Questionnaire' });
        }
      }
    } catch (error) {
      console.error('[StartupNavigation] Startup navigation error:', error);
      // Fallback to auth screen on any error
      setPendingRoute({ route: 'Auth' });
    } finally {
      // will be cleared after navigation attempt succeeds
    }
  }, [stytch, refreshAuthState, initializeFromBootstrap, bootstrapDone]);

  useEffect(() => {
    if (!bootstrapDone) {
      const timer = setTimeout(handleStartupNavigation, 100);
      return () => clearTimeout(timer);
    }
  }, [bootstrapDone, handleStartupNavigation]);

  // Attempt navigation once we have a pending route and nav is ready
  useEffect(() => {
    if (!pendingRoute || hasNavigated) {
      return;
    }

    if (!isNavReady) {
      console.log('[StartupNavigation] Waiting for navigation ready...');
      const retry = setTimeout(
        () => setNavigationAttempt(prev => prev + 1),
        50,
      );
      return () => clearTimeout(retry);
    }

    console.log(
      '[StartupNavigation] Attempting navigation',
      pendingRoute.route,
      pendingRoute.params || '',
      'attempt:',
      navigationAttempt,
    );

    const success = safeNavigate(pendingRoute.route, pendingRoute.params);
    if (success) {
      console.log('[StartupNavigation] Navigation succeeded');
      setHasNavigated(true);
      setIsInitializing(false);
      return;
    }

    console.warn('[StartupNavigation] Navigation attempt failed, retrying...');
    const retry = setTimeout(() => setNavigationAttempt(prev => prev + 1), 100);
    return () => clearTimeout(retry);
  }, [
    pendingRoute,
    isNavReady,
    hasNavigated,
    safeNavigate,
    navigationAttempt,
  ]);

  // Always render children so NavigationContainer can become ready;
  // overlay loading screen while startup is in progress.
  return (
    <>
      {children}
      {isInitializing && <LoadingScreen />}
    </>
  );
};
