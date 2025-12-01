import React, { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AppCard,
  AppText,
  AppTextInput,
  AppDateTimePicker,
  AppTag,
  Box,
} from '@/shared/components/ui';
import { BORDER_WIDTH } from '@/shared/theme';
import { formatRelativeDateTimeForDisplay } from '@/utils/timezoneUtils';
import type { NotesCardProps } from '../types';

export const NotesCard: React.FC<NotesCardProps> = ({
  trackingTypes,
  selectedTrackingTypeId,
  selectedDateTime,
  notes,
  maxChars,
  accentColor,
  onTrackingTypeSelect,
  onDateTimeChange,
  onNotesChange,
  onNotesFocus,
}) => {
  const { t } = useTranslation();
  const remainingChars = maxChars - notes.length;

  const cardAccentStyle = useMemo<ViewStyle>(
    () => ({
      borderLeftColor: accentColor,
      borderLeftWidth: BORDER_WIDTH.lg,
    }),
    [accentColor],
  );

  if (!trackingTypes || trackingTypes.length === 0) {
    return null;
  }

  return (
    <AppCard variant="elevated" size="md" p="lg" style={cardAccentStyle}>
      <Box gap="sm">
        <AppText variant="subcaption" tone="muted">
          {t('journal.loggingLabel')}
        </AppText>
        <Box flexDirection="row" flexWrap="wrap" gap="sm">
          {trackingTypes.map(type => {
            const isSelected = selectedTrackingTypeId === type.id;
            return (
              <AppTag
                key={type.id}
                label={type.displayName}
                selected={isSelected}
                onPress={() => onTrackingTypeSelect(type.id)}
              />
            );
          })}
        </Box>
      </Box>
      <AppDateTimePicker
        label={t('journal.whenLabel')}
        value={selectedDateTime}
        onChange={onDateTimeChange}
        mode="datetime"
        maximumDate={new Date()}
        formatDisplay={date =>
          formatRelativeDateTimeForDisplay(date.toISOString())
        }
      />
      <Box gap="sm">
        <AppText variant="subcaption" tone="muted">
          {t('journal.notesLabel')}
        </AppText>
        <AppTextInput
          variant="secondary"
          value={notes}
          onChangeText={onNotesChange}
          onFocus={onNotesFocus}
          placeholder={t('journal.notesPlaceholder')}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Box alignItems="flex-end">
          <AppText variant="subcaption" tone="primary">
            {t('journal.charactersRemaining', { count: remainingChars })}
          </AppText>
        </Box>
      </Box>
    </AppCard>
  );
};
