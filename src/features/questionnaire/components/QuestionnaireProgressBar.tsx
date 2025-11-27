import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '@/shared/theme';

type QuestionnaireProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
};

export const QuestionnaireProgressBar = ({
  currentQuestion,
  totalQuestions,
}: QuestionnaireProgressBarProps) => {
  // Calculate progress percentage
  const progress = Math.min(currentQuestion / totalQuestions, 1);
  const progressPercentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <AppText variant="caption" tone="secondary" style={styles.progressText}>
        {currentQuestion}/{totalQuestions}
      </AppText>

      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${progressPercentage}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: SPACING.xs / 2,
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.inkDark,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_PALETTE.textPrimary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLOR_PALETTE.borderDefault,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLOR_PALETTE.accentPrimary,
    borderRadius: 2,
  },
});
