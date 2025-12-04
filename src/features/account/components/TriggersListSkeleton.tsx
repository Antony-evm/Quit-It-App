import React from 'react';

import { AppCard, Box, SkeletonBox } from '@/shared/components/ui';
import { ANSWER_GRID_MIN_HEIGHT } from '@/shared/theme/layout';

const SKELETON_ITEMS = 6;

export const TriggersListSkeleton: React.FC = () => {
  return (
    <AppCard variant="filled" p="zero">
      <Box flexDirection="row" flexWrap="wrap" gap="lg" p="md">
        {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <SkeletonBox
            key={index}
            height={ANSWER_GRID_MIN_HEIGHT}
            borderRadius="medium"
            style={{ flexBasis: '40%', flexGrow: 1 }}
          />
        ))}
      </Box>
    </AppCard>
  );
};
