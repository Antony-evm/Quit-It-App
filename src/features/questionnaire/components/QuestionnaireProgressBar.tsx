import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';

const PROGRESS_BAR_RADIUS = 3;

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
  const progress = Math.min(currentQuestion / totalQuestions, 1);
  const progressPercentage = Math.round(progress * 100);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isAnimating = isLoading || isSubmitting;

  useEffect(() => {
    if (isAnimating) {
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
      pulseAnim.setValue(1);
    }
  }, [isAnimating, pulseAnim]);

  return (
    <Box alignItems="center" py="xs" bg="backgroundMuted" borderRadius="small">
      <AppText variant="subcaption" tone="primary" bold centered>
        {currentQuestion}/{totalQuestions}
      </AppText>

      <Box variant="progressTrack">
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
  progressFill: {
    height: '100%',
    backgroundColor: COLOR_PALETTE.textPrimary,
    borderRadius: PROGRESS_BAR_RADIUS,
  },
});
