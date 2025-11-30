import React from 'react';
import { AppPressable, Box, SkeletonBox } from '@/shared/components/ui';
import { SYSTEM } from '@/shared/theme';

/** Skeleton dimension constants matching TrackingRecordCard layout */
const SKELETON_DIMENSIONS = {
  tag: { width: 80, height: 24 },
  time: { width: 50, height: 14 },
  date: { width: 60, height: 14 },
  textLine: { height: 16 },
  textLineShort: { width: '70%' as const, height: 16 },
} as const;

export type TrackingRecordCardSkeletonProps = {
  /** Number of skeleton cards to render */
  count?: number;
  /** Enable shimmer animation */
  animated?: boolean;
};

const SingleSkeleton = React.memo(
  ({ animated = true }: { animated?: boolean }) => (
    <AppPressable
      variant="cardStrip"
      disabled
      disabledOpacity={1}
      style={{ borderLeftColor: SYSTEM.border }}
    >
      <Box variant="noteHeader">
        <SkeletonBox
          width={SKELETON_DIMENSIONS.tag.width}
          height={SKELETON_DIMENSIONS.tag.height}
          animated={animated}
        />

        <Box alignItems="flex-end" gap="xs">
          <SkeletonBox
            width={SKELETON_DIMENSIONS.time.width}
            height={SKELETON_DIMENSIONS.time.height}
            animated={animated}
          />
          <SkeletonBox
            width={SKELETON_DIMENSIONS.date.width}
            height={SKELETON_DIMENSIONS.date.height}
            animated={animated}
          />
        </Box>
      </Box>

      <Box variant="note">
        <SkeletonBox
          height={SKELETON_DIMENSIONS.textLine.height}
          mb="xs"
          animated={animated}
        />
        <SkeletonBox
          width={SKELETON_DIMENSIONS.textLineShort.width}
          height={SKELETON_DIMENSIONS.textLineShort.height}
          animated={animated}
        />
      </Box>
    </AppPressable>
  ),
);

export const TrackingRecordCardSkeleton = React.memo(
  ({ count = 1, animated = true }: TrackingRecordCardSkeletonProps) => {
    if (count === 1) {
      return <SingleSkeleton animated={animated} />;
    }

    return (
      <Box gap="md">
        {Array.from({ length: count }, (_, index) => (
          <SingleSkeleton key={index} animated={animated} />
        ))}
      </Box>
    );
  },
);
