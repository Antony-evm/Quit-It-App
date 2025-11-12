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
            <AppText variant="heading" style={styles.textBlock}>
              {response.question}
            </AppText>
            <View style={styles.answerBlock}>
              <AppText variant="heading" style={styles.textBlock}>
                {answer.primary}
              </AppText>
              {answer.secondary ? (
                <AppText
                  variant="body"
                  tone="secondary"
                  style={styles.answerMeta}
                >
                  {answer.secondary}
                </AppText>
              ) : null}
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

  const values = response.answerOptions
    .map(option => option.answer_value.trim())
    .filter(value => value.length > 0);

  return {
    primary: values.length ? values.join(', ') : 'No answer selected',
  };
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  list: {
    gap: SPACING.md,
  },
  card: {
    gap: SPACING.md,
  },
  textBlock: {
    marginBottom: 0,
  },
  answerBlock: {
    gap: SPACING.xs,
  },
  answerMeta: {
    fontStyle: 'italic',
  },
});
