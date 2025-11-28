import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BRAND_COLORS } from '@/shared/theme';
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

    // Iterate through main options (time slots)
    question.options.forEach(option => {
      // Check if we have a frequency value for this time slot
      const frequencyValue = frequency[option.value];

      if (frequencyValue) {
        // Find the matching sub-option (frequency level)
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
      <AppSurface style={[styles.card, style]}>
        <AppText tone="primary" style={styles.loadingText}>
          Loading frequency data...
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
          Unable to load frequency data
        </AppText>
      </AppSurface>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <AppSurface style={[styles.card, style]}>
      <FrequencyGrid
        options={question.options}
        subOptions={question.subOptions}
        initialSubSelection={initialSubSelection}
        onSubSelectionChange={() => {}}
        onMainSelectionChange={() => {}}
        onValidityChange={() => {}}
      />
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND_COLORS.inkDark,
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
