import { useQuery } from '@tanstack/react-query';
import { fetchSmokingAnalytics } from '../api/fetchSmokingAnalytics';
import { SmokingAnalyticsResponse } from '../types';

const placeholderData: SmokingAnalyticsResponse = {
  last_smoking_day: new Date(0),
  total_smokes: 0,
  skipped_smokes: 0,
  skipped_smokes_per_day: 0,
  savings_per_day: 0,
  savings: 0,
};

export const useSmokingAnalytics = () => {
  return useQuery<SmokingAnalyticsResponse>({
    queryKey: ['smokingAnalytics'],
    queryFn: () => fetchSmokingAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData,
  });
};
