import { useState, useEffect, useCallback } from 'react';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '@/shared/auth';
import AuthService from '@/shared/auth/authService';
import { bootstrapAuthState } from '@/shared/auth/authBootstrap';
import { StartupNavigationService } from '@/shared/services/startupNavigationService';
import {
  NetworkTimeoutError,
  NetworkConnectionError,
} from '@/shared/api/interceptors/TimeoutInterceptor';
import type { RootStackParamList } from '@/types/navigation';

type PendingRoute = {
  [K in keyof RootStackParamList]: {
    route: K;
    params?: RootStackParamList[K];
  };
}[keyof RootStackParamList];

export interface UseStartupNavigationResult {
  isInitializing: boolean;
  pendingRoute: PendingRoute | null;
  hasNavigated: boolean;
  hasNetworkError: boolean;
  networkErrorMessage: string | null;
  markNavigated: () => void;
  retryStartup: () => void;
}

/**
 * Hook that handles startup navigation logic
 * Bootstraps auth state and determines initial route
 */
export const useStartupNavigation = (): UseStartupNavigationResult => {
  const { initializeFromBootstrap, refreshAuthState } = useAuth();
  const stytch = useStytch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<PendingRoute | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [networkErrorMessage, setNetworkErrorMessage] = useState<string | null>(
    null,
  );

  /**
   * Handle the startup navigation bootstrap process
   */
  const handleStartupNavigation = useCallback(async (): Promise<void> => {
    try {
      // Clear any previous error state
      setHasNetworkError(false);
      setNetworkErrorMessage(null);

      // Bootstrap auth state from storage and validate session
      const authResult = await bootstrapAuthState(stytch);

      // Initialize auth context with bootstrapped state
      initializeFromBootstrap({
        tokens: authResult.tokens,
        user: authResult.user,
      });

      // Clear invalid tokens if session is invalid
      if (authResult.isAuthenticated && !authResult.isSessionValid) {
        await AuthService.clearAuth();
        await refreshAuthState();
      }

      // Determine the startup route based on auth result
      const route = StartupNavigationService.determineStartupRoute(authResult);
      setPendingRoute(route);
    } catch (error) {
      console.error('[useStartupNavigation] Bootstrap error:', error);

      // Handle network errors specifically
      if (
        error instanceof NetworkTimeoutError ||
        error instanceof NetworkConnectionError
      ) {
        setHasNetworkError(true);
        setNetworkErrorMessage(
          error instanceof NetworkTimeoutError
            ? 'Connection timed out. Please check your internet and try again.'
            : 'Cannot connect to server. Please check your internet connection.',
        );
        setIsInitializing(false);
        return;
      }

      // Fallback to auth screen on any other error
      setPendingRoute({ route: 'Auth' });
    }
  }, [stytch, initializeFromBootstrap, refreshAuthState]);

  /**
   * Mark navigation as completed
   */
  const markNavigated = useCallback((): void => {
    setHasNavigated(true);
    setIsInitializing(false);
  }, []);

  /**
   * Retry the startup process after a network error
   */
  const retryStartup = useCallback((): void => {
    setIsInitializing(true);
    setHasNavigated(false);
    setHasNetworkError(false);
    setNetworkErrorMessage(null);
    void handleStartupNavigation();
  }, [handleStartupNavigation]);

  // Run startup navigation only once on mount
  useEffect(() => {
    if (!bootstrapDone) {
      setBootstrapDone(true);
      void handleStartupNavigation();
    }
  }, [handleStartupNavigation, bootstrapDone]);

  return {
    isInitializing,
    pendingRoute,
    hasNavigated,
    hasNetworkError,
    networkErrorMessage,
    markNavigated,
    retryStartup,
  };
};
