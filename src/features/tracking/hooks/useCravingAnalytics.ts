import { useQuery } from '@tanstack/react-query';
import { fetchCravingAnalytics } from '../api/fetchCravingAnalytics';
import { useCurrentUserId } from './useCurrentUserId';
import { CravingAnalyticsResponse } from '../types';

export const useCravingAnalytics = () => {
  const userId = useCurrentUserId();

  return useQuery<CravingAnalyticsResponse>({
    queryKey: ['cravingAnalytics', userId],
    queryFn: () => fetchCravingAnalytics(),
    enabled: !!userId && userId > 0,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
