import React from 'react';

import { AppText, Box, AppPressable, AppTag } from '@/shared/components/ui';
import { COLOR_PALETTE, hexToRgba } from '@/shared/theme';
import { useTrackingTypes } from '../hooks/useTrackingTypes';
import type { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';

type TrackingRecordCardProps = {
  record: TrackingRecordApiResponse;
  onPress?: (record: TrackingRecordApiResponse) => void;
};

export const TrackingRecordCard = React.memo(
  ({ record, onPress }: TrackingRecordCardProps) => {
    const { data: trackingTypes } = useTrackingTypes();

    const trackingType = trackingTypes?.find(
      type => type.id === record.tracking_type_id,
    );

    const isCraving = trackingType?.displayName
      .toLowerCase()
      .includes('craving');
    const isSmoke =
      trackingType?.displayName.toLowerCase().includes('smoke') ||
      trackingType?.displayName.toLowerCase().includes('cigarette');

    const accentColor = isCraving
      ? COLOR_PALETTE.craving
      : isSmoke
      ? COLOR_PALETTE.cigarette
      : COLOR_PALETTE.borderDefault;

    const badgeBackgroundColor = isCraving
      ? hexToRgba(COLOR_PALETTE.craving, 0.1)
      : isSmoke
      ? hexToRgba(COLOR_PALETTE.cigarette, 0.1)
      : hexToRgba(COLOR_PALETTE.borderDefault, 0.1);

    const date = new Date(record.event_at);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const recordDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const diffTime = today.getTime() - recordDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let dateLabel = '';
    if (diffDays === 0) {
      dateLabel = 'Today';
    } else if (diffDays === 1) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }

    const timeLabel = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });

    return (
      <AppPressable
        variant="cardStrip"
        style={{ borderLeftColor: accentColor }}
        onPress={() => onPress?.(record)}
      >
        <Box variant="noteHeader">
          <AppTag
            label={
              trackingType?.displayName || `Type ${record.tracking_type_id}`
            }
            color={badgeBackgroundColor}
            size="small"
          />
          <Box alignItems="flex-end" gap="xs">
            <AppText variant="subcaption">{timeLabel}</AppText>
            <AppText variant="subcaption" tone="muted">
              {dateLabel}
            </AppText>
          </Box>
        </Box>

        <Box variant="note">
          {record.note ? (
            <AppText>{record.note}</AppText>
          ) : (
            <AppText tone="muted">Add a thought about this moment…</AppText>
          )}
        </Box>
      </AppPressable>
    );
  },
);
