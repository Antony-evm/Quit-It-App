import React from 'react';
import { StyleSheet } from 'react-native';

import type { QuestionnaireResponseRecord } from '../types';
import { AppCard, AppText, Box } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';
import { resolveAnswerDisplay } from '../utils/answerFormatting';

type QuestionnaireReviewProps = {
  responses: QuestionnaireResponseRecord[];
};

export const QuestionnaireReview = ({
  responses,
}: QuestionnaireReviewProps) => (
  <Box gap="lg">
    <Box gap="lg">
      {responses.map(response => {
        const answer = resolveAnswerDisplay(response);
        return (
          <AppCard key={response.questionId} style={styles.card}>
            <AppText variant="body">{response.question}</AppText>
            <Box gap="lg">
              <AppText variant="caption" style={styles.answerText}>
                {answer.primary}
              </AppText>
            </Box>
          </AppCard>
        );
      })}
    </Box>
  </Box>
);

const styles = StyleSheet.create({
  card: {
    gap: SPACING.lg,
  },
  answerText: {
    lineHeight: 30,
  },
});
