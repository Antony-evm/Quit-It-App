import React from 'react';

import { AppCard, Box, SkeletonBox } from '@/shared/components/ui';

const SKELETON_ROWS = 4;

export const FrequencyDataSkeleton: React.FC = () => {
  return (
    <AppCard variant="filled" p="zero">
      <Box variant="gridContainer">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <Box key={index} variant="gridRow">
            {/* Clock and label section */}
            <Box justifyContent="center" alignItems="center" p="zero">
              <Box justifyContent="center" alignItems="center" gap="xs">
                <SkeletonBox height={60} width={60} borderRadius="full" />
                <SkeletonBox height={12} width={70} borderRadius="small" />
              </Box>
            </Box>
            {/* Slider section */}
            <Box variant="sliderContainer">
              <SkeletonBox height={48} width="90%" borderRadius="small" />
            </Box>
          </Box>
        ))}
      </Box>
    </AppCard>
  );
};
