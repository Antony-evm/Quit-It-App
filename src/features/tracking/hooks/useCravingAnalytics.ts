import { useQuery } from '@tanstack/react-query';
import { fetchCravingAnalytics } from '../api/fetchCravingAnalytics';
import { CravingAnalyticsResponse } from '../types';

const placeholderData: CravingAnalyticsResponse = {
  total_cravings: 0,
  days_with_cravings: 0,
  cravings_by_day: {},
};

export const useCravingAnalytics = () => {
  return useQuery<CravingAnalyticsResponse>({
    queryKey: ['cravingAnalytics'],
    queryFn: () => fetchCravingAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData,
  });
};
