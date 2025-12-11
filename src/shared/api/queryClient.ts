import { QueryClient } from '@tanstack/react-query';
import {
  NetworkTimeoutError,
  NetworkConnectionError,
} from './interceptors/TimeoutInterceptor';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      // Retry configuration for network errors
      retry: (failureCount, error) => {
        // Don't retry network errors - let the UI handle them
        if (
          error instanceof NetworkTimeoutError ||
          error instanceof NetworkConnectionError
        ) {
          return false;
        }
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
    },
    mutations: {
      // Don't retry mutations on network errors
      retry: (failureCount, error) => {
        if (
          error instanceof NetworkTimeoutError ||
          error instanceof NetworkConnectionError
        ) {
          return false;
        }
        return false; // Don't retry mutations by default
      },
    },
  },
  // Suppress error logging for network errors - they're handled by the UI
  logger: {
    log: console.log,
    warn: console.warn,
    error: (error) => {
      // Suppress network errors from being logged by React Query
      if (
        error instanceof NetworkTimeoutError ||
        error instanceof NetworkConnectionError
      ) {
        return;
      }
      console.error(error);
    },
  },
});

/**
 * Clear all cached data from React Query.
 * Should be called on logout to ensure no stale user data persists.
 */
export const clearQueryCache = (): void => {
  queryClient.clear();
};
