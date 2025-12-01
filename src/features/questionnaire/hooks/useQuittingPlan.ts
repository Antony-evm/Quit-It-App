import { useQuery } from '@tanstack/react-query';
import { fetchQuittingPlan } from '../api/fetchQuittingPlan';
import type { QuittingPlan } from '../types';

export const QUITTING_PLAN_QUERY_KEY = ['quittingPlan'] as const;

export const useQuittingPlan = () => {
  const query = useQuery<QuittingPlan>({
    queryKey: QUITTING_PLAN_QUERY_KEY,
    queryFn: fetchQuittingPlan,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    plan: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: query.refetch,
  };
};
