import { useQuery } from '@tanstack/react-query';
import { fetchQuestion } from '../api/fetchQuestion';
import { SMOKING_TRIGGERS_QUESTION_CODE } from '../constants';
import type { Question } from '../types';

export const SMOKING_TRIGGERS_QUESTION_QUERY_KEY = [
  'question',
  SMOKING_TRIGGERS_QUESTION_CODE,
] as const;

export const useSmokingTriggersQuestion = () => {
  const query = useQuery<Question | null>({
    queryKey: SMOKING_TRIGGERS_QUESTION_QUERY_KEY,
    queryFn: () =>
      fetchQuestion({
        questionCode: SMOKING_TRIGGERS_QUESTION_CODE,
      }),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    question: query.data ?? null,
    isLoading: query.isLoading,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
        ? String(query.error)
        : null,
  };
};
