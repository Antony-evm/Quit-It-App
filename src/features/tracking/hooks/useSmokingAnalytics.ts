import { useQuery } from '@tanstack/react-query';
import { fetchSmokingAnalytics } from '../api/fetchSmokingAnalytics';
import { useCurrentUserId } from './useCurrentUserId';
import { SmokingAnalyticsResponse } from '../types';

export const useSmokingAnalytics = () => {
  const userId = useCurrentUserId();

  return useQuery<SmokingAnalyticsResponse>({
    queryKey: ['smokingAnalytics', userId],
    queryFn: () => fetchSmokingAnalytics(),
    enabled: !!userId && userId > 0,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
