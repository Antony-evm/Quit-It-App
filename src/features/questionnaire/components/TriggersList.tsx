import React, { useMemo } from 'react';
import { AppCard, StatusMessage } from '@/shared/components/ui';
import { useTriggers } from '@/features/questionnaire/hooks/useTriggers';
import { useSmokingTriggersQuestion } from '@/features/questionnaire/hooks/useSmokingTriggersQuestion';
import { QuestionnaireQuestion } from '@/features/questionnaire/components/QuestionnaireQuestion';
import type { SelectedAnswerOption } from '@/features/questionnaire/types';

interface TriggersListProps {
  style?: any;
}

export const TriggersList: React.FC<TriggersListProps> = ({ style }) => {
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

  if (isLoading) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="loading" message="Loading triggers..." />
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message="Unable to load triggers" />
      </AppCard>
    );
  }

  return (
    <AppCard variant="filled" p="zero">
      <QuestionnaireQuestion
        question={question}
        initialSelection={initialSelection}
        onSelectionChange={() => {}}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};
