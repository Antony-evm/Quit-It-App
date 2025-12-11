import { useState, useEffect } from 'react';
import {
  NetworkTimeoutError,
  NetworkConnectionError,
} from '@/shared/api/interceptors/TimeoutInterceptor';

interface NetworkErrorState {
  hasError: boolean;
  errorCount: number;
  lastErrorTime: number | null;
}

const RESET_THRESHOLD_MS = 5000; // Reset error count after 5 seconds of no errors
const ERROR_THRESHOLD = 3; // Show offline screen after 3 consecutive errors

/**
 * Global hook to track network errors and show offline screen
 * when multiple consecutive network errors occur
 */
export const useGlobalNetworkError = () => {
  const [errorState, setErrorState] = useState<NetworkErrorState>({
    hasError: false,
    errorCount: 0,
    lastErrorTime: null,
  });

  useEffect(() => {
    // Store original rejection handler
    const promiseRejectionTracker = require('react-native/Libraries/promiseRejectionTrackingOptions');
    const originalOnUnhandled = promiseRejectionTracker.default.onUnhandled;

    // Custom handler that tracks network errors
    promiseRejectionTracker.default.onUnhandled = (
      id: string,
      rejection: { message: string } | Error,
    ) => {
      const error = rejection as Error;
      const message =
        typeof rejection === 'string' ? rejection : error?.message;

      const isNetworkError =
        error instanceof NetworkTimeoutError ||
        error instanceof NetworkConnectionError ||
        (message &&
          (message.includes('NetworkTimeoutError') ||
            message.includes('NetworkConnectionError')));

      if (isNetworkError) {
        setErrorState(prev => {
          const now = Date.now();
          const timeSinceLastError = prev.lastErrorTime
            ? now - prev.lastErrorTime
            : Infinity;

          // Reset count if errors stopped for a while
          const newCount =
            timeSinceLastError > RESET_THRESHOLD_MS ? 1 : prev.errorCount + 1;

          return {
            hasError: newCount >= ERROR_THRESHOLD,
            errorCount: newCount,
            lastErrorTime: now,
          };
        });

        // Suppress the error log
        console.log('[Network Error Tracked]', message);
        return;
      }

      // Call original handler for non-network errors
      if (originalOnUnhandled) {
        originalOnUnhandled(id, rejection);
      }
    };

    // Cleanup
    return () => {
      promiseRejectionTracker.default.onUnhandled = originalOnUnhandled;
    };
  }, []);

  const resetError = () => {
    setErrorState({
      hasError: false,
      errorCount: 0,
      lastErrorTime: null,
    });
  };

  return {
    hasNetworkError: errorState.hasError,
    resetNetworkError: resetError,
  };
};
