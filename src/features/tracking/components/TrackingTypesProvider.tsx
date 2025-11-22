import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';

import { fetchTrackingTypes } from '../api/fetchTrackingTypes';

type TrackingTypesProviderProps = {
  children: React.ReactNode;
};

/**
 * Provider component that conditionally prefetches tracking types
 * only when the user should navigate to home based on their status.
 */
export const TrackingTypesProvider: React.FC<TrackingTypesProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only prefetch tracking types if user is authenticated and should navigate to home
    const shouldLoadTrackingTypes = async () => {
      if (!isAuthenticated || !user?.userStatusId) {
        return;
      }

      try {
        // Initialize status service if not already done
        if (!UserStatusService.getStatus(user.userStatusId)) {
          await UserStatusService.initialize();
        }

        const action = UserStatusService.getStatusAction(user.userStatusId);

        // Only load tracking types if user should navigate to home
        if (action?.type === 'NAVIGATE_TO_HOME') {
          console.log('Prefetching tracking types for home navigation');
          queryClient.prefetchQuery({
            queryKey: ['trackingTypes'],
            queryFn: fetchTrackingTypes,
            staleTime: Infinity,
            gcTime: Infinity,
          });
        }
      } catch (error) {
        console.error(
          'Failed to determine if tracking types should be loaded:',
          error,
        );
      }
    };

    shouldLoadTrackingTypes();
  }, [queryClient, isAuthenticated, user?.userStatusId]);

  return <>{children}</>;
};
