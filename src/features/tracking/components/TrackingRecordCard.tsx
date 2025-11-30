import React from 'react';
import { StyleSheet } from 'react-native';

import {
  AppSurface,
  AppText,
  Box,
  AppPressable,
  AppTag,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';
import { LAYOUT_STYLES, TEXT_STYLES } from '@/shared/styles/commonStyles';
import { useTrackingTypes } from '../hooks/useTrackingTypes';
import type { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';
import { formatRelativeDateTimeForDisplay } from '@/utils/timezoneUtils';

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
      ? 'rgba(122, 62, 177, 0.1)'
      : isSmoke
      ? 'rgba(214, 106, 61, 0.1)'
      : 'rgba(59, 101, 93, 0.1)';

    // Date formatting logic
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
        variant="card"
        onPress={() => onPress?.(record)}
        style={[
          styles.card,
          { borderLeftColor: accentColor, borderLeftWidth: 4 },
        ]}
      >
        <Box
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <AppTag
            label={
              trackingType?.displayName || `Type ${record.tracking_type_id}`
            }
            color={badgeBackgroundColor}
            size="small"
            style={styles.badgeSelf}
          />
          <Box alignItems="flex-end" gap="xs">
            <AppText variant="subcaption">{timeLabel}</AppText>
            <AppText variant="gridArea" tone="muted">
              {dateLabel}
            </AppText>
          </Box>
        </Box>

        <Box
          px="md"
          py="sm"
          mt="md"
          bg="backgroundMuted"
          borderRadius="medium"
          style={styles.noteSection}
        >
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

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    overflow: 'hidden',
    padding: SPACING.md,
  },
  badgeSelf: {
    alignSelf: 'flex-start',
  },
  noteSection: {
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
});
