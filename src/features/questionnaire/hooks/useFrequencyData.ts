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

  const initialSubSelection = useMemo(() => {
    if (!question || !frequency) {
      return [];
    }

    const selection: SelectedAnswerSubOption[] = [];

    question.options.forEach(option => {
      const frequencyValue = frequency[option.value];

      if (frequencyValue) {
        const subOption = question.subOptions.find(
          sub => sub.value === frequencyValue,
        );

        if (subOption) {
          selection.push({
            optionId: subOption.id,
            value: subOption.value,
            answerType: question.subAnswerType || 'multiple_choice',
            combination: subOption.combination,
            mainOptionId: option.id,
          });
        }
      }
    });

    return selection;
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
