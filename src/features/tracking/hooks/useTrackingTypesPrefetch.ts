import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';

import { fetchTrackingTypes } from '../api/fetchTrackingTypes';

/**
 * Hook that conditionally prefetches tracking types into React Query's cache
 * only when the user should navigate to home based on their status.
 *
 * This hook should be called once at the app level, after AuthProvider.
 */
export const useTrackingTypesPrefetch = (): void => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const prefetchTrackingTypes = async () => {
      if (!isAuthenticated || !user?.userStatusId) {
        return;
      }

      try {
        // Initialize status service if not already done
        if (!UserStatusService.getStatus(user.userStatusId)) {
          await UserStatusService.initialize();
        }

        if (cancelled) return;

        const action = UserStatusService.getStatusAction(user.userStatusId);

        // Only load tracking types if user should navigate to home
        if (action?.type === 'NAVIGATE_TO_HOME') {
          queryClient.prefetchQuery({
            queryKey: ['trackingTypes'],
            queryFn: fetchTrackingTypes,
            staleTime: Infinity,
            gcTime: Infinity,
          });
        }
      } catch (error) {
        console.warn('[useTrackingTypesPrefetch] Failed to prefetch:', error);
      }
    };

    prefetchTrackingTypes();

    return () => {
      cancelled = true;
    };
  }, [queryClient, isAuthenticated, user?.userStatusId]);
};
