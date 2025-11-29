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

type PendingRoute = {
  [K in keyof RootStackParamList]: {
    route: K;
    params?: RootStackParamList[K];
  };
}[keyof RootStackParamList];

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
  const [pendingRoute, setPendingRoute] = useState<PendingRoute | null>(null);
  const [navigationAttempt, setNavigationAttempt] = useState(0);

  // Safe navigation helper
  const safeNavigate = useCallback(
    <RouteName extends keyof RootStackParamList>(
      routeName: RouteName,
      params?: RootStackParamList[RouteName],
    ) => {
      try {
        if (!isNavReady) {
          return false;
        }

        return resetNavigation(routeName, params);
      } catch (error) {
        return false;
      }
    },
    [isNavReady],
  );

  const handleStartupNavigation = useCallback(async () => {
    try {
      const authResult = await bootstrapAuthState(stytch);

      initializeFromBootstrap({
        tokens: authResult.tokens,
        user: authResult.user,
      });

      // Case 1: No tokens found - navigate to signup
      if (!authResult.isAuthenticated) {
        setPendingRoute({ route: 'Auth', params: { mode: 'signup' } });
        return;
      }

      // Case 2: Tokens exist but are invalid - navigate to login
      if (authResult.isAuthenticated && !authResult.isSessionValid) {
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
        const userStatusId = authResult.user.userStatusId;

        if (!userStatusId) {
          setPendingRoute({ route: 'Questionnaire' });
          return;
        }

        // Get user status action (service should be initialized in authBootstrap)
        try {
          // Get the action to determine the navigation target
          const action = UserStatusService.getStatusAction(userStatusId);

          if (!action) {
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
              setPendingRoute({ route: 'Questionnaire' });
          }
        } catch (statusError) {
          // Fallback to questionnaire if status service fails
          setPendingRoute({ route: 'Questionnaire' });
        }
      }
    } catch (error) {
      // Fallback to auth screen on any error
      setPendingRoute({ route: 'Auth' });
    }
  }, [stytch, refreshAuthState, initializeFromBootstrap]);

  // Run startup navigation only once on mount
  useEffect(() => {
    if (!bootstrapDone) {
      setBootstrapDone(true);
      void handleStartupNavigation();
    }
  }, []);

  // Attempt navigation once we have a pending route and nav is ready
  useEffect(() => {
    if (!pendingRoute || hasNavigated || !isNavReady) {
      return;
    }

    const success = safeNavigate(pendingRoute.route, pendingRoute.params);

    if (success) {
      setHasNavigated(true);
      setIsInitializing(false);
    } else {
      // Retry with a slight delay
      const retry = setTimeout(
        () => setNavigationAttempt(prev => prev + 1),
        100,
      );
      return () => clearTimeout(retry);
    }
  }, [pendingRoute, isNavReady, hasNavigated, safeNavigate, navigationAttempt]);

  // Always render children so NavigationContainer can become ready;
  // overlay loading screen while startup is in progress.
  return (
    <>
      {children}
      {isInitializing && <LoadingScreen />}
    </>
  );
};
