import { useQuery } from '@tanstack/react-query';
import { fetchSmokingAnalytics } from '../api/fetchSmokingAnalytics';
import { useCurrentUserId } from './useCurrentUserId';
import { SmokingAnalyticsResponse } from '../types';

export const useSmokingAnalytics = () => {
  const userId = useCurrentUserId();

  return useQuery<SmokingAnalyticsResponse>({
    queryKey: ['smokingAnalytics', userId],
    queryFn: () => fetchSmokingAnalytics({ user_id: userId }),
    enabled: !!userId && userId > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};