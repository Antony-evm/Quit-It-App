import { useQuery } from '@tanstack/react-query';
import { fetchTriggers } from '../api/fetchTriggers';

export const TRIGGERS_QUERY_KEY = ['triggers'] as const;

export const useTriggers = () => {
  const query = useQuery<string[]>({
    queryKey: TRIGGERS_QUERY_KEY,
    queryFn: fetchTriggers,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    triggers: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: query.refetch,
  };
};
