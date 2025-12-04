import React from 'react';

import { AppCard, Box, SkeletonBox } from '@/shared/components/ui';

const SKELETON_ITEMS = 6;

export const TriggersListSkeleton: React.FC = () => {
  return (
    <AppCard variant="filled" p="zero">
      <Box gap="sm" p="md">
        {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <SkeletonBox
            key={index}
            height={48}
            borderRadius="medium"
            width="100%"
          />
        ))}
      </Box>
    </AppCard>
  );
};
