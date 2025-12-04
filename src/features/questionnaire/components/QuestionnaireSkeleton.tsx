import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AppCard, Box } from '@/shared/components/ui';
import { SYSTEM, SPACING, BORDER_WIDTH } from '@/shared/theme';

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

// Skeleton row matching FrequencyGrid's gridRow layout
const FrequencyGridRowSkeleton = ({ isLast = false }: { isLast?: boolean }) => {
  return (
    <Box style={[styles.gridRow, isLast && styles.gridRowLast]}>
      {/* Clock and label section */}
      <Box justifyContent="center" alignItems="center" p="zero">
        <Box justifyContent="center" alignItems="center" gap="xs">
          {/* Clock placeholder - circular */}
          <SkeletonItem width={60} height={60} style={styles.clockSkeleton} />
          {/* Hours label placeholder */}
          <SkeletonItem width={70} height={12} />
        </Box>
      </Box>
      {/* Slider section */}
      <Box style={styles.sliderSection}>
        <SkeletonItem
          width="90%"
          height={SPACING.xl * 2}
          style={styles.sliderSkeleton}
        />
      </Box>
    </Box>
  );
};

// Skeleton for FrequencyGrid with 4 rows (typical time periods)
export const FrequencyGridSkeleton = () => {
  const rowCount = 4;
  return (
    <Box variant="gridContainer">
      {Array.from({ length: rowCount }).map((_, index) => (
        <FrequencyGridRowSkeleton key={index} isLast={index === rowCount - 1} />
      ))}
    </Box>
  );
};

export const QuestionnaireSkeleton = () => {
  return (
    <Box style={styles.container} py="md">
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
    backgroundColor: SYSTEM.accentMuted,
    borderRadius: 4,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: SYSTEM.border,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
    borderBottomWidth: BORDER_WIDTH.sm,
    borderBottomColor: SYSTEM.border,
  },
  gridRowLast: {
    borderBottomWidth: 0,
  },
  clockSkeleton: {
    borderRadius: 30, // Half of 60 to make it circular
  },
  sliderSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderSkeleton: {
    borderRadius: 8,
  },
});
