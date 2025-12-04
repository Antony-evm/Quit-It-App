import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
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
