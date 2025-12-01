import { useQuery } from '@tanstack/react-query';
import { fetchFrequency, FrequencyData } from '../api/fetchFrequency';

export const FREQUENCY_QUERY_KEY = ['frequency'] as const;

export const useFrequency = () => {
  const query = useQuery<FrequencyData>({
    queryKey: FREQUENCY_QUERY_KEY,
    queryFn: fetchFrequency,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    frequency: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: query.refetch,
  };
};
