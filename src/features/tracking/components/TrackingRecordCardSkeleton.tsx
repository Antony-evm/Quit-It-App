import React from 'react';
import { AppPressable, Box } from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';

export const TrackingRecordCardSkeleton = () => {
  return (
    <AppPressable
      variant="cardStrip"
      disabled
      disabledOpacity={1}
      style={{ borderLeftColor: COLOR_PALETTE.borderDefault }}
    >
      <Box variant="noteHeader">
        {/* Tag Skeleton */}
        <Box
          bg="borderDefault"
          borderRadius="small"
          style={{ width: 80, height: 24, opacity: 0.3 }}
        />

        <Box alignItems="flex-end" gap="xs">
          {/* Time Skeleton */}
          <Box
            bg="borderDefault"
            borderRadius="small"
            style={{ width: 50, height: 14, opacity: 0.3 }}
          />
          {/* Date Skeleton */}
          <Box
            bg="borderDefault"
            borderRadius="small"
            style={{ width: 60, height: 14, opacity: 0.3 }}
          />
        </Box>
      </Box>

      <Box variant="note">
        <Box
          bg="borderDefault"
          borderRadius="small"
          mb="xs"
          style={{ height: 16, opacity: 0.3, width: '100%' }}
        />
        <Box
          bg="borderDefault"
          borderRadius="small"
          style={{ height: 16, opacity: 0.3, width: '70%' }}
        />
      </Box>
    </AppPressable>
  );
};


