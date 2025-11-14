import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { fetchTrackingTypes } from '../api/fetchTrackingTypes';

type TrackingTypesProviderProps = {
  children: React.ReactNode;
};

/**
 * Provider component that prefetches tracking types at app startup
 * and ensures they're available in the cache for all components.
 */
export const TrackingTypesProvider: React.FC<TrackingTypesProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch tracking types to ensure they're available throughout the app
    queryClient.prefetchQuery({
      queryKey: ['trackingTypes'],
      queryFn: fetchTrackingTypes,
      staleTime: Infinity,
      gcTime: Infinity,
    });
  }, [queryClient]);

  return <>{children}</>;
};
