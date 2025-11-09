import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { QuestionnaireResponseRecord } from '../types';
import { AppSurface, AppText } from '../../../shared/components/ui';
import { COLOR_PALETTE, SPACING } from '../../../shared/theme';

type QuestionnaireReviewProps = {
  responses: QuestionnaireResponseRecord[];
};

export const QuestionnaireReview = ({ responses }: QuestionnaireReviewProps) => (
  <View style={styles.container}>
    <View style={styles.lead}>
      <AppText variant="caption" tone="secondary">
        Summary
      </AppText>
      <AppText variant="title">Your responses</AppText>
    </View>
    <View style={styles.list}>
      {responses.map((response) => (
        <AppSurface key={response.questionId} style={styles.card}>
          <AppText variant="caption" tone="secondary" style={styles.cardEyebrow}>
            Question
          </AppText>
          <AppText variant="heading">{response.question}</AppText>
          <View style={styles.answers}>
            {response.answerOptions.map((answer) => (
              <View
                key={`${response.questionId}-${answer.answer_option_id}`}
                style={styles.answerPill}>
                <AppText variant="body">{answer.answer_value}</AppText>
              </View>
            ))}
          </View>
        </AppSurface>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  lead: {
    gap: SPACING.xs,
  },
  list: {
    gap: SPACING.md,
  },
  card: {
    gap: SPACING.md,
  },
  cardEyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  answers: {
    gap: SPACING.xs,
  },
  answerPill: {
    borderRadius: 12,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
});
