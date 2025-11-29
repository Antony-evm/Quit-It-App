import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppSurface } from '@/shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '@/shared/theme';

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
    <View style={styles.container}>
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
      <View style={styles.optionsContainer}>
        <AppSurface style={[styles.optionCard, { height: 400 }]}>
          <SkeletonItem width="100%" height="100%" />
        </AppSurface>
      </View>
    </View>
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
    padding: SPACING.lg,
    backgroundColor: BRAND_COLORS.ink,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
});
