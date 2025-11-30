import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { AppText, AppCard, Box, StatusMessage } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useFrequency } from '@/features/questionnaire/hooks/useFrequency';
import { useSmokingFrequencyQuestion } from '@/features/questionnaire/hooks/useSmokingFrequencyQuestion';
import { FrequencyGrid } from '@/features/questionnaire/components/FrequencyGrid';
import type { SelectedAnswerSubOption } from '@/features/questionnaire/types';

interface FrequencyDataProps {
  style?: any;
}

export const FrequencyData: React.FC<FrequencyDataProps> = ({ style }) => {
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

  if (isLoading) {
    return (
      <AppCard variant="filled" p="zero" style={[styles.card, style]}>
        <StatusMessage type="loading" message="Loading frequency data..." />
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard variant="filled" p="zero" style={[styles.card, style]}>
        <StatusMessage type="error" message="Unable to load frequency data" />
      </AppCard>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <AppCard variant="filled" p="zero" style={[styles.card, style]}>
      <FrequencyGrid
        options={question.options}
        subOptions={question.subOptions}
        initialSubSelection={initialSubSelection}
        onSubSelectionChange={() => {}}
        onMainSelectionChange={() => {}}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
  },
});
