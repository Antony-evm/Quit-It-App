import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import { AppSurface, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';
import { LAYOUT_STYLES, TEXT_STYLES } from '@/shared/styles/commonStyles';
import { useTrackingTypes } from '../hooks/useTrackingTypes';
import type { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';
import { formatRelativeDateTimeForDisplay } from '@/utils/timezoneUtils';

type TrackingRecordCardProps = {
  record: TrackingRecordApiResponse;
  onPress?: (record: TrackingRecordApiResponse) => void;
};

export const TrackingRecordCard = React.memo(({
  record,
  onPress,
}: TrackingRecordCardProps) => {
  const { data: trackingTypes } = useTrackingTypes();

  const trackingType = trackingTypes?.find(
    type => type.id === record.tracking_type_id,
  );

  const formattedDate = formatRelativeDateTimeForDisplay(record.event_at);

  return (
    <Pressable onPress={() => onPress?.(record)}>
      <AppSurface style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdown}>
              <AppText style={styles.dropdownText}>
                {trackingType?.displayName || `Type ${record.tracking_type_id}`}
              </AppText>
            </View>
          </View>
        </View>
        <View style={[styles.section, styles.dateTimeContainer]}>
          <AppText
            variant="caption"
            tone="primary"
            style={[styles.dateTimeDisplay, styles.dateTimeContent]}
          >
            {formattedDate}
          </AppText>
        </View>
        <View style={styles.noteSection}>
          {record.note ? (
            <AppText variant="body" style={styles.noteText}>
              {record.note}
            </AppText>
          ) : (
            <AppText variant="body" style={styles.notePlaceholder}>
              Add a thought about this moment…
            </AppText>
          )}
        </View>
      </AppSurface>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  noteSection: {
    paddingTop: SPACING.md,
    marginHorizontal: SPACING.sm,
    borderTopWidth: 2,
    borderTopColor: COLOR_PALETTE.borderDefault,
  },
  noteText: {
    color: COLOR_PALETTE.textPrimary,
    fontStyle: 'italic',
  },
  notePlaceholder: {
    color: COLOR_PALETTE.textMuted,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 0,
  },
  dropdownContainer: {
    ...LAYOUT_STYLES.dropdownContainer,
    flex: 1,
    marginRight: SPACING.md,
  },
  dropdown: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: BORDER_RADIUS.medium,
    ...LAYOUT_STYLES.rowBetween,
  },
  dropdownText: {
    ...TEXT_STYLES.dropdownText,
  },
  dateTimeContainer: {
    marginTop: 0,
    marginBottom: SPACING.sm,
  },
  dateTimeContent: {
    marginHorizontal: SPACING.sm,
    paddingVertical: 0,
  },
  dateTimeDisplay: {
    color: COLOR_PALETTE.textPrimary,
  },
});
