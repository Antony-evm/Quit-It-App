import React from 'react';

import { AppText, Box, AppPressable, AppTag } from '@/shared/components/ui';
import { BACKGROUND, BORDER_WIDTH } from '@/shared/theme';

export type TrackingRecordCardProps = {
  displayName: string;
  accentColor: string;
  dateLabel: string;
  timeLabel: string;
  note: string | null;
  index?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export const TrackingRecordCard = React.memo(
  ({
    displayName,
    accentColor,
    dateLabel,
    timeLabel,
    note,
    index,
    onPress,
    accessibilityLabel,
  }: TrackingRecordCardProps) => {
    const isAlternating = index !== undefined && index % 2 !== 0;
    // Slightly lighter than primary background (#022C22) for separation

    return (
      <AppPressable
        variant="card"
        style={{
          borderLeftWidth: BORDER_WIDTH.lg,
          borderLeftColor: accentColor,
          backgroundColor: isAlternating
            ? BACKGROUND.primary
            : BACKGROUND.pressed,
        }}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ||
          `${displayName} logged ${dateLabel} at ${timeLabel}${
            note ? `. Note: ${note}` : ''
          }`
        }
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb="sm"
        >
          <AppTag label={displayName} color={accentColor} size="small" />
          <Box alignItems="flex-end" gap="xs">
            <AppText variant="subcaption">{timeLabel}</AppText>
            <AppText variant="subcaption" tone="muted">
              {dateLabel}
            </AppText>
          </Box>
        </Box>

        <Box variant="note" mt="md">
          {note ? (
            <AppText>{note}</AppText>
          ) : (
            <AppText tone="muted">Add a thought about this moment…</AppText>
          )}
        </Box>
      </AppPressable>
    );
  },
);
