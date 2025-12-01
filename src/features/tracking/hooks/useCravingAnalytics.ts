import { useQuery } from '@tanstack/react-query';
import { fetchCravingAnalytics } from '../api/fetchCravingAnalytics';
import { CravingAnalyticsResponse } from '../types';

export const useCravingAnalytics = () => {
  return useQuery<CravingAnalyticsResponse>({
    queryKey: ['cravingAnalytics'],
    queryFn: () => fetchCravingAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
