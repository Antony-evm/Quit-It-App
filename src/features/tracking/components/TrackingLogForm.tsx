import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AppButton,
  AppSurface,
  AppText,
  AppTextInput,
} from '@/shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '@/shared/theme';
import { DEFAULT_TRACKING_USER_ID } from '../constants';
import { useTrackingTypes } from '../hooks/useTrackingTypes';
import { createTrackingRecord } from '../api/createTrackingRecord';
import type { TrackingType } from '../types';

type TrackingLogFormProps = {
  userId?: number;
};

type PickerMode = 'date' | 'time' | null;

const formatDisplayDate = (value: Date) =>
  value.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatDisplayTime = (value: Date) =>
  value.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

export const TrackingLogForm = ({ userId }: TrackingLogFormProps) => {
  const resolvedUserId = userId ?? DEFAULT_TRACKING_USER_ID;
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [eventAt, setEventAt] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const queryClient = useQueryClient();

  const trackingTypesQuery = useTrackingTypes();
  const trackingTypes = trackingTypesQuery.data;
  const isTypesLoading = trackingTypesQuery.isLoading;
  const trackingTypesError = trackingTypesQuery.error as Error | null;
  const refetchTrackingTypes = trackingTypesQuery.refetch;

  useEffect(() => {
    if (!selectedTypeId && trackingTypes && trackingTypes.length > 0) {
      setSelectedTypeId(trackingTypes[0].id);
    }
  }, [selectedTypeId, trackingTypes]);

  const mutation = useMutation({
    mutationFn: () =>
      createTrackingRecord({
        user_id: resolvedUserId,
        tracking_type_id: selectedTypeId!,
        event_at: eventAt.toISOString(),
        note: note.trim() === '' ? undefined : note.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackingLogs', resolvedUserId] });
      setNote('');
      setEventAt(new Date());
    },
  });

  const isSaving = mutation.isPending;
  const isSubmitDisabled = !selectedTypeId || isSaving;
  const mutationError = mutation.error as Error | null;

  const selectedType = useMemo<TrackingType | undefined>(() => {
    return trackingTypes?.find((type) => type.id === selectedTypeId);
  }, [selectedTypeId, trackingTypes]);

  const handleSelectType = useCallback(
    (typeId: number) => {
      setSelectedTypeId(typeId);
      setDropdownOpen(false);
    },
    [],
  );

  const handleToggleDropdown = useCallback(() => {
    setDropdownOpen((current) => !current);
  }, []);

  const handleShowPicker = useCallback((mode: PickerMode) => {
    setPickerMode(mode);
  }, []);

  const handlePickerChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      const nextMode = pickerMode;

      if (Platform.OS === 'android') {
        setPickerMode(null);
      }

      if (!selectedDate || !nextMode) {
        return;
      }

      setEventAt((current) => {
        const next = new Date(current);
        if (nextMode === 'date') {
          next.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
        } else if (nextMode === 'time') {
          next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
        }
        return next;
      });
    },
    [pickerMode],
  );

  const handleSubmit = useCallback(() => {
    if (!selectedTypeId || isSaving) {
      return;
    }

    mutation.mutate();
  }, [isSaving, mutation, selectedTypeId]);

  const renderDropdown = () => {
    const options: TrackingType[] = trackingTypes ?? [];

    if (!isDropdownOpen || !options.length) {
      return null;
    }

    return (
      <View style={styles.dropdown}>
        {options.map((type, index) => {
          const isSelected = type.id === selectedTypeId;
          const isLast = index === options.length - 1;
          return (
            <Pressable
              key={type.id}
              onPress={() => handleSelectType(type.id)}
              style={[
                styles.dropdownOption,
                isLast && styles.dropdownOptionLast,
                isSelected && styles.dropdownOptionSelected,
              ]}
            >
              <AppText
                style={[
                  styles.dropdownOptionLabel,
                  isSelected && styles.dropdownOptionLabelSelected,
                ]}
              >
                {type.displayName}
              </AppText>
              {type.description ? (
                <AppText tone="secondary" style={styles.dropdownOptionDescription}>
                  {type.description}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    if (isTypesLoading && !trackingTypes?.length) {
      return (
        <View style={styles.stateWrapper}>
          <ActivityIndicator color={COLOR_PALETTE.accentPrimary} />
          <AppText tone="secondary" style={styles.stateHelper}>
            Loading tracking types...
          </AppText>
        </View>
      );
    }

    if (trackingTypesError) {
      return (
        <View style={styles.stateWrapper}>
          <AppText tone="secondary" style={styles.stateHelper}>
            Unable to load tracking types.
          </AppText>
          <AppButton label="Retry" onPress={() => refetchTrackingTypes()} size="sm" />
        </View>
      );
    }

    if (!trackingTypes?.length) {
      return (
        <View style={styles.stateWrapper}>
          <AppText tone="secondary" style={styles.stateHelper}>
            No tracking types available yet.
          </AppText>
        </View>
      );
    }

    return (
      <>
        <View style={styles.fieldGroup}>
          <AppText variant="caption" tone="secondary">
            Tracking type
          </AppText>
          <Pressable style={styles.dropdownTrigger} onPress={handleToggleDropdown}>
            <AppText>
              {selectedType?.displayName ?? 'Select a tracking type'}
            </AppText>
          </Pressable>
          {renderDropdown()}
        </View>

        <View style={styles.fieldGroup}>
          <AppText variant="caption" tone="secondary">
            Logged at
          </AppText>
          <View style={styles.dateTimeRow}>
            <View>
              <AppText variant="heading">{formatDisplayDate(eventAt)}</AppText>
              <AppText tone="secondary">{formatDisplayTime(eventAt)}</AppText>
            </View>
            <View style={styles.dateButtons}>
              <AppButton
                label="Change date"
                variant="outline"
                size="sm"
                onPress={() => handleShowPicker('date')}
              />
              <AppButton
                label="Change time"
                variant="outline"
                size="sm"
                onPress={() => handleShowPicker('time')}
              />
            </View>
          </View>
          {pickerMode ? (
            <DateTimePicker
              value={eventAt}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={handlePickerChange}
            />
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <AppText variant="caption" tone="secondary">
            Notes (optional)
          </AppText>
          <AppTextInput
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            placeholder="What happened?"
            style={styles.noteInput}
          />
        </View>

        {mutationError ? (
          <AppText style={styles.errorText}>{mutationError.message}</AppText>
        ) : null}

        <AppButton
          label={isSaving ? 'Saving...' : 'Save log'}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          fullWidth
        />
      </>
    );
  };

  return (
    <AppSurface style={styles.card}>
      <AppText variant="title" style={styles.cardTitle}>
        Create a log
      </AppText>
      {renderContent()}
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  cardTitle: {
    marginBottom: SPACING.xs,
  },
  fieldGroup: {
    gap: SPACING.xs,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 12,
    marginTop: SPACING.xs,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    maxHeight: 240,
  },
  dropdownOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionSelected: {
    backgroundColor: BRAND_COLORS.cream,
  },
  dropdownOptionLabel: {
    fontWeight: '600',
  },
  dropdownOptionLabelSelected: {
    color: COLOR_PALETTE.backgroundMuted,
  },
  dropdownOptionDescription: {
    marginTop: SPACING.xs,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dateButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  noteInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLOR_PALETTE.accentPrimary,
  },
  stateWrapper: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  stateHelper: {
    textAlign: 'center',
  },
});
