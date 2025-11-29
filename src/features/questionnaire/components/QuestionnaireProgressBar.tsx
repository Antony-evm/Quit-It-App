import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

type QuestionnaireProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
  isLoading?: boolean;
  isSubmitting?: boolean;
};

export const QuestionnaireProgressBar = ({
  currentQuestion,
  totalQuestions,
  isLoading = false,
  isSubmitting = false,
}: QuestionnaireProgressBarProps) => {
  // Calculate progress percentage
  const progress = Math.min(currentQuestion / totalQuestions, 1);
  const progressPercentage = Math.round(progress * 100);

  // Animation for loading/submitting state
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isAnimating = isLoading || isSubmitting;

  useEffect(() => {
    if (isAnimating) {
      // Start pulsing animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      // Reset to normal state
      pulseAnim.setValue(1);
    }
  }, [isAnimating, pulseAnim]);

  return (
    <Box
      style={styles.container}
      alignItems="center"
      py="xs"
      bg="backgroundMuted"
      borderRadius="small"
    >
      <AppText variant="caption" tone="secondary" style={styles.progressText}>
        {currentQuestion}/{totalQuestions}
      </AppText>

      <Box style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
              transform: [{ scaleY: pulseAnim }],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: SPACING.xs / 2,
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
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
    backgroundColor: COLOR_PALETTE.textPrimary,
    borderRadius: 2,
  },
});
