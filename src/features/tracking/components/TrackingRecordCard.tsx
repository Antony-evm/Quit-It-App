import React from 'react';

import { AppText, Box, AppPressable, AppTag } from '@/shared/components/ui';

export type TrackingRecordCardProps = {
  displayName: string;
  accentColor: string;
  badgeBackgroundColor: string;
  dateLabel: string;
  timeLabel: string;
  note: string | null;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export const TrackingRecordCard = React.memo(
  ({
    displayName,
    accentColor,
    badgeBackgroundColor,
    dateLabel,
    timeLabel,
    note,
    onPress,
    accessibilityLabel,
  }: TrackingRecordCardProps) => {
    return (
      <AppPressable
        variant="cardStrip"
        style={{ borderLeftColor: accentColor }}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ||
          `${displayName} logged ${dateLabel} at ${timeLabel}${
            note ? `. Note: ${note}` : ''
          }`
        }
      >
        <Box variant="noteHeader">
          <AppTag
            label={displayName}
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
