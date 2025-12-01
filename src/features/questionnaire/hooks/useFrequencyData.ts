import { useMemo } from 'react';
import { useFrequency } from './useFrequency';
import { useSmokingFrequencyQuestion } from './useSmokingFrequencyQuestion';
import type { SelectedAnswerSubOption } from '../types';

export const useFrequencyData = () => {
  const {
    frequency,
    isLoading: isFrequencyLoading,
    error: frequencyError,
  } = useFrequency();
  const {
    question,
    isLoading: isQuestionLoading,
    error: questionError,
  } = useSmokingFrequencyQuestion();

  const initialSubSelection = useMemo((): SelectedAnswerSubOption[] => {
    if (!question || !frequency) {
      return [];
    }

    return question.options.flatMap(option => {
      const frequencyValue = frequency[option.value];
      if (!frequencyValue) return [];

      const subOption = question.subOptions.find(
        sub => sub.value === frequencyValue,
      );
      if (!subOption) return [];

      return [
        {
          optionId: subOption.id,
          value: subOption.value,
          answerType: question.subAnswerType || 'multiple_choice',
          combination: subOption.combination,
          mainOptionId: option.id,
        },
      ];
    });
  }, [question, frequency]);

  const isLoading = isFrequencyLoading || isQuestionLoading;
  const error = frequencyError || questionError;

  return {
    question,
    initialSubSelection,
    isLoading,
    error,
  };
};
