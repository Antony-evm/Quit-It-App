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

  const initialSelection = useMemo(() => {
    if (!question || !triggers) {
      return [];
    }

    const selection: SelectedAnswerOption[] = [];
    triggers.forEach(triggerValue => {
      const option = question.options.find(opt => opt.value === triggerValue);
      if (option) {
        selection.push({
          optionId: option.id,
          value: option.value,
          answerType: question.answerType,
          nextVariationId: option.nextVariationId,
        });
      }
    });

    return selection;
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
