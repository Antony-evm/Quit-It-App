import { useState, useEffect, useCallback } from 'react';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '@/shared/auth';
import AuthService from '@/shared/auth/authService';
import { bootstrapAuthState } from '@/shared/auth/authBootstrap';
import { StartupNavigationService } from '@/shared/services/startupNavigationService';
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
  markNavigated: () => void;
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

  /**
   * Handle the startup navigation bootstrap process
   */
  const handleStartupNavigation = useCallback(async (): Promise<void> => {
    try {
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
      // Fallback to auth screen on any error
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
    markNavigated,
  };
};
