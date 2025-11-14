import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppSurface, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import type { TrackingRecord } from '../types';

type TrackingLogCardProps = {
  record: TrackingRecord;
};

const formatEventDate = (value: string): string => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const datePart = parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = parsed.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${datePart} at ${timePart}`;
};

const TrackingLogCardComponent = ({ record }: TrackingLogCardProps) => {
  return (
    <AppSurface style={styles.card}>
      <View style={styles.header}>
        <AppText variant="caption" tone="secondary">
          #{record.id}
        </AppText>
        <AppText variant="caption" tone="secondary">
          Type {record.trackingTypeId}
        </AppText>
      </View>
      <AppText variant="heading" style={styles.timestamp}>
        {formatEventDate(record.eventAt)}
      </AppText>
      <AppText tone={record.note ? 'primary' : 'secondary'}>
        {record.note?.trim() || 'No note provided'}
      </AppText>
    </AppSurface>
  );
};

export const TrackingLogCard = memo(TrackingLogCardComponent);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  timestamp: {
    marginBottom: SPACING.xs,
    color: COLOR_PALETTE.textPrimary,
  },
});
