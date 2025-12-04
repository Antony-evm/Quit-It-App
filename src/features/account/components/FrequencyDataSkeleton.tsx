import React from 'react';

import { AppCard, Box, SkeletonBox } from '@/shared/components/ui';

const SKELETON_ROWS = 4;

export const FrequencyDataSkeleton: React.FC = () => {
  return (
    <AppCard variant="filled" p="zero">
      <Box gap="lg" p="md">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <Box key={index} flexDirection="row" alignItems="center" gap="md">
            {/* Clock skeleton */}
            <Box alignItems="center" gap="xs">
              <SkeletonBox height={60} width={60} borderRadius="full" />
              <SkeletonBox height={14} width={80} borderRadius="small" />
            </Box>
            {/* Slider skeleton */}
            <Box flex={1} gap="xs">
              <SkeletonBox height={40} width="100%" borderRadius="small" />
              <Box alignItems="center">
                <SkeletonBox height={16} width={60} borderRadius="small" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </AppCard>
  );
};
