import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
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

    // Map triggers (strings) to options
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
      <AppSurface style={[styles.card, style]}>
        <AppText tone="primary" style={styles.loadingText}>
          Loading triggers...
        </AppText>
      </AppSurface>
    );
  }

  if (error) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText
          style={[styles.errorText, { color: COLOR_PALETTE.systemError }]}
        >
          Unable to load triggers
        </AppText>
      </AppSurface>
    );
  }

  return (
    <AppSurface style={[styles.card, style]}>
      <QuestionnaireQuestion
        question={question}
        initialSelection={initialSelection}
        onSelectionChange={() => {}}
        onValidityChange={() => {}}
      />
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 0,
    padding: 0,
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
