import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { AppSurface, AppText, Box } from '@/shared/components/ui';
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
      <Pressable onPress={() => onPress?.(record)}>
        <AppSurface
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
            <Box
              px="md"
              py="xs"
              borderRadius="full"
              style={[
                styles.badgeSelf,
                { backgroundColor: badgeBackgroundColor },
              ]}
            >
              <AppText
                style={[styles.badgeText, { color: COLOR_PALETTE.textPrimary }]}
              >
                {trackingType?.displayName || `Type ${record.tracking_type_id}`}
              </AppText>
            </Box>
            <Box alignItems="flex-end">
              <AppText style={styles.timeText}>{timeLabel}</AppText>
              <AppText style={styles.dateText}>{dateLabel}</AppText>
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
              <AppText variant="body" style={styles.noteText}>
                {record.note}
              </AppText>
            ) : (
              <AppText variant="body" style={styles.notePlaceholder}>
                Add a thought about this moment…
              </AppText>
            )}
          </Box>
        </AppSurface>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    padding: SPACING.md,
  },
  badgeSelf: {
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_PALETTE.textPrimary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: COLOR_PALETTE.textMuted,
  },
  noteSection: {
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  noteText: {
    color: COLOR_PALETTE.textPrimary,
    lineHeight: 22,
  },
  notePlaceholder: {
    color: COLOR_PALETTE.textMuted,
    fontStyle: 'italic',
  },
});
