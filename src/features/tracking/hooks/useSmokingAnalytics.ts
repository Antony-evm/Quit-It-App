import { useQuery } from '@tanstack/react-query';
import { fetchSmokingAnalytics } from '../api/fetchSmokingAnalytics';
import { SmokingAnalyticsResponse } from '../types';

export const useSmokingAnalytics = () => {
  return useQuery<SmokingAnalyticsResponse>({
    queryKey: ['smokingAnalytics'],
    queryFn: () => fetchSmokingAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
