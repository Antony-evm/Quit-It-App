import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';

import { fetchTrackingTypes } from '../api/fetchTrackingTypes';
import type { TrackingType } from '../types';

export const useTrackingTypes = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<TrackingType[]>({
    queryKey: ['trackingTypes'],
    queryFn: fetchTrackingTypes,
    enabled: isAuthenticated, // Only fetch when user is authenticated
    staleTime: Infinity, // Data never becomes stale since tracking types rarely change
    gcTime: Infinity, // Keep data in cache indefinitely
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting to network
  });
};
