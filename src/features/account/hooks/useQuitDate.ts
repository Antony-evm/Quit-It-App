import { useQuery } from '@tanstack/react-query';
import { fetchQuitDate } from '../api/fetchQuitDate';
import type { QuitDate } from '../types';

export const useQuitDate = () => {
  const {
    data: quitDate,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['quitDate'],
    queryFn: fetchQuitDate,
  });

  return {
    quitDate: quitDate ?? null,
    isLoading,
    isRefetching,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refresh: refetch,
  };
};
