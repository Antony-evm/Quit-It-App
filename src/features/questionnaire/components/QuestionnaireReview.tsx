import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { QuestionnaireResponseRecord } from '../types';
import { AppSurface, AppText } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';
import {
  formatDisplayDate,
  getRelativeDateInfo,
  parseSubmissionDateValue,
} from '../utils/dateFormatting';

type QuestionnaireReviewProps = {
  responses: QuestionnaireResponseRecord[];
};

export const QuestionnaireReview = ({
  responses,
}: QuestionnaireReviewProps) => (
  <View style={styles.container}>
    <View style={styles.list}>
      {responses.map(response => {
        const answer = resolveAnswerDisplay(response);
        return (
          <AppSurface key={response.questionId} style={styles.card}>
            <AppText variant="body">{response.question}</AppText>
            <View style={styles.answerBlock}>
              <AppText variant="caption" style={styles.answerText}>
                {answer.primary}
              </AppText>
            </View>
          </AppSurface>
        );
      })}
    </View>
  </View>
);

type AnswerDisplay = {
  primary: string;
  secondary?: string;
};

const resolveAnswerDisplay = (
  response: QuestionnaireResponseRecord,
): AnswerDisplay => {
  if (!response.answerOptions.length) {
    return {
      primary: 'No answer selected',
    };
  }

  if (response.answerType === 'date') {
    const first = response.answerOptions[0];
    const parsed = parseSubmissionDateValue(first?.answer_value ?? '');

    if (parsed) {
      return {
        primary: formatDisplayDate(parsed),
        secondary: getRelativeDateInfo(parsed) || undefined,
      };
    }
  }

  // Create combined main answer - sub option pairs
  const combinedValues = response.answerOptions
    .map(option => {
      const mainValue = option.answer_value.trim();
      if (!mainValue) return null;

      const subValue = option.answer_sub_option_value?.trim();

      if (subValue) {
        // Handle date formatting for sub-options
        let formattedSubValue = subValue;
        if (option.answer_sub_option_type === 'date') {
          const parsed = parseSubmissionDateValue(subValue);
          formattedSubValue = parsed ? formatDisplayDate(parsed) : subValue;
        }

        return `${mainValue} - ${formattedSubValue}`;
      }

      return mainValue;
    })
    .filter(value => value !== null) as string[];

  if (!combinedValues.length) {
    return {
      primary: 'No answer selected',
    };
  }

  // Join multiple values with line breaks
  const primary = combinedValues.join('\n');

  return {
    primary,
  };
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  list: {
    gap: SPACING.lg,
  },
  card: {
    gap: SPACING.lg,
  },
  textBlock: {
    marginBottom: SPACING.xs,
  },
  answerBlock: {
    gap: SPACING.lg,
  },
  answerText: {
    lineHeight: 30,
  },
});
