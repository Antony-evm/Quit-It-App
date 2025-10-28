import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { QuestionnaireResponseRecord } from '../../types/questionnaire';
import { AppSurface, AppText } from '../atoms';
import { SPACING } from '../../theme';

type QuestionnaireReviewProps = {
  responses: QuestionnaireResponseRecord[];
};

export const QuestionnaireReview = ({ responses }: QuestionnaireReviewProps) => (
  <View style={styles.container}>
    <AppText variant="title">Your responses</AppText>
    <View style={styles.list}>
      {responses.map((response) => (
        <AppSurface key={response.questionId} style={styles.card}>
          <AppText variant="heading">{response.question}</AppText>
          <View style={styles.answers}>
            {response.answerOptions.map((answer) => (
              <AppText key={`${response.questionId}-${answer.answer_option_id}`}>
                {answer.answer_value}
              </AppText>
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
  list: {
    gap: SPACING.md,
  },
  card: {
    gap: SPACING.sm,
  },
  answers: {
    gap: SPACING.xs,
  },
});
