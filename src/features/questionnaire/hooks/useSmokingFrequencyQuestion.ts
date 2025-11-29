import { useQuery } from '@tanstack/react-query';
import { fetchQuestion } from '../api/fetchQuestion';
import { SMOKING_FREQUENCY_QUESTION_CODE } from '../constants';

export const useSmokingFrequencyQuestion = () => {
  const {
    data: question,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['question', SMOKING_FREQUENCY_QUESTION_CODE],
    queryFn: () =>
      fetchQuestion({
        questionCode: SMOKING_FREQUENCY_QUESTION_CODE,
      }),
    staleTime: Infinity,
  });

  return {
    question: question ?? null,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  };
};
