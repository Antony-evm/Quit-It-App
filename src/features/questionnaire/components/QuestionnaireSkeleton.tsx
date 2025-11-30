import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AppCard, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

export const SkeletonItem = ({
  width,
  height,
  style,
}: {
  width: number | string;
  height: number | string;
  style?: any;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeletonItem, { width, height, opacity }, style]}
    />
  );
};

export const QuestionnaireSkeleton = () => {
  return (
    <Box style={styles.container} py="md">
      {/* Question Title Skeleton */}
      <SkeletonItem
        width="80%"
        height={32}
        style={{ marginBottom: SPACING.sm }}
      />
      <SkeletonItem
        width="60%"
        height={32}
        style={{ marginBottom: SPACING.xl }}
      />

      {/* Question Subtitle/Explanation Skeleton */}
      <SkeletonItem
        width="90%"
        height={20}
        style={{ marginBottom: SPACING.xs }}
      />
      <SkeletonItem
        width="70%"
        height={20}
        style={{ marginBottom: SPACING.xxl }}
      />

      {/* Options Skeleton */}
      <Box gap="md">
        <AppCard style={[styles.optionCard, { height: 400 }]}>
          <SkeletonItem width="100%" height="100%" />
        </AppCard>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.md,
  },
  skeletonItem: {
    backgroundColor: COLOR_PALETTE.accentMuted,
    borderRadius: 4,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
});
