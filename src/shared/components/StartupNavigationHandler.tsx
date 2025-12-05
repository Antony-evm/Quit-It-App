import React, { useEffect, useState, useCallback } from 'react';
import { useNavigationReady } from '@/navigation/NavigationContext';
import { resetNavigation } from '@/navigation/navigationRef';
import { useStartupNavigation } from '@/shared/hooks/useStartupNavigation';
import { LoadingScreen } from './LoadingScreen';
import type { RootStackParamList } from '@/types/navigation';

interface StartupNavigationHandlerProps {
  children: React.ReactNode;
}

/**
 * Component that orchestrates startup navigation
 * Logic delegated to useStartupNavigation hook
 */
export const StartupNavigationHandler: React.FC<
  StartupNavigationHandlerProps
> = ({ children }) => {
  const { isReady: isNavReady } = useNavigationReady();
  const { isInitializing, pendingRoute, hasNavigated, markNavigated } =
    useStartupNavigation();
  const [navigationAttempt, setNavigationAttempt] = useState(0);

  /**
   * Safe navigation helper that checks if navigation is ready
   */
  const safeNavigate = useCallback(
    <RouteName extends keyof RootStackParamList>(
      routeName: RouteName,
      params?: RootStackParamList[RouteName],
    ): boolean => {
      try {
        if (!isNavReady) {
          return false;
        }
        return resetNavigation(routeName, params);
      } catch (error) {
        console.error('[StartupNavigationHandler] Navigation error:', error);
        return false;
      }
    },
    [isNavReady],
  );

  /**
   * Attempt navigation once we have a pending route and nav is ready
   */
  useEffect(() => {
    if (!pendingRoute || hasNavigated || !isNavReady) {
      return;
    }

    const success = safeNavigate(pendingRoute.route, pendingRoute.params);

    if (success) {
      markNavigated();
    } else {
      // Retry with a slight delay
      const retry = setTimeout(
        () => setNavigationAttempt(prev => prev + 1),
        100,
      );
      return () => clearTimeout(retry);
    }
  }, [
    pendingRoute,
    isNavReady,
    hasNavigated,
    safeNavigate,
    navigationAttempt,
    markNavigated,
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
