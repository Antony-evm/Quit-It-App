import { useMemo } from 'react';
import { useTriggers } from './useTriggers';
import { useSmokingTriggersQuestion } from './useSmokingTriggersQuestion';
import type { SelectedAnswerOption } from '../types';

export const useTriggersData = () => {
  const {
    triggers,
    isLoading: isTriggersLoading,
    error: triggersError,
  } = useTriggers();
  const {
    question,
    isLoading: isQuestionLoading,
    error: questionError,
  } = useSmokingTriggersQuestion();

  const initialSelection = useMemo((): SelectedAnswerOption[] => {
    if (!question || !triggers) {
      return [];
    }

    return triggers.flatMap(triggerValue => {
      const option = question.options.find(opt => opt.value === triggerValue);
      if (!option) return [];

      return [
        {
          optionId: option.id,
          value: option.value,
          answerType: question.answerType,
          nextVariationId: option.nextVariationId,
        },
      ];
    });
  }, [question, triggers]);

  const isLoading = isTriggersLoading || isQuestionLoading;
  const error = triggersError || questionError;

  return {
    question,
    initialSelection,
    isLoading,
    error,
  };
};
