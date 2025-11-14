import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
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
import { COLOR_PALETTE, SPACING, BRAND_COLORS } from '@/shared/theme';
import { useTrackingTypes } from '@/features/tracking';
import {
  createTrackingRecord,
  CreateTrackingRecordPayload,
} from '@/features/tracking/api/createTrackingRecord';
import { DEFAULT_TRACKING_USER_ID } from '@/features/tracking/constants';
import { useToast } from '@/shared/components/toast';

type NotesCardProps = {
  userId?: number;
  onSave?: (data: {
    trackingTypeId: number;
    dateTime: Date;
    notes: string;
  }) => void;
  onSaveSuccess?: () => void;
};

export const NotesCard: React.FC<NotesCardProps> = ({
  userId = DEFAULT_TRACKING_USER_ID,
  onSave,
  onSaveSuccess,
}) => {
  const { data: trackingTypes } = useTrackingTypes();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [selectedTrackingTypeId, setSelectedTrackingTypeId] = useState<
    number | null
  >(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  // Mutation for creating tracking record
  const createRecordMutation = useMutation({
    mutationFn: createTrackingRecord,
    onSuccess: () => {
      // Invalidate and refetch tracking-related queries
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });

      // Reset form
      setNotes('');
      setSelectedDateTime(new Date());
      setShowDateTimePicker(false);
      setShowDropdown(false);

      // Call success callback
      onSaveSuccess?.();

      // Show success message
      showToast('Your tracking entry has been saved!', 'success');
    },
    onError: error => {
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to save tracking entry',
        'error'
      );
    },
  });

  // Set default tracking type when data loads
  React.useEffect(() => {
    if (
      trackingTypes &&
      trackingTypes.length > 0 &&
      selectedTrackingTypeId === null
    ) {
      setSelectedTrackingTypeId(trackingTypes[0].id);
    }
  }, [trackingTypes, selectedTrackingTypeId]);

  const selectedTrackingType = trackingTypes?.find(
    type => type.id === selectedTrackingTypeId,
  );

  const maxChars = 500;
  const remainingChars = maxChars - notes.length;

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleDateTimePress = () => {
    setShowDropdown(false); // Close dropdown when interacting with date/time
    setPickerMode('date'); // Always start with date selection
    setShowDateTimePicker(true);
  };

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (selectedDate) {
      if (pickerMode === 'date') {
        // Update the date part
        const newDateTime = new Date(selectedDateTime);
        newDateTime.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
        setSelectedDateTime(newDateTime);

        // On Android, after date selection, switch to time
        if (Platform.OS === 'android') {
          setPickerMode('time');
          return; // Keep picker open for time selection
        } else {
          // On iOS, show time picker after date
          setPickerMode('time');
        }
      } else if (pickerMode === 'time') {
        // Update the time part
        const newDateTime = new Date(selectedDateTime);
        newDateTime.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0,
          0,
        );
        setSelectedDateTime(newDateTime);

        // Close picker after time selection
        setShowDateTimePicker(false);
      }
    } else {
      // User cancelled
      setShowDateTimePicker(false);
    }
  };

  const handleNotesChange = (text: string) => {
    setShowDropdown(false); // Close dropdown when typing in notes
    if (text.length <= maxChars) {
      setNotes(text);
    }
  };

  const handleTrackingTypeSelect = (trackingTypeId: number) => {
    setSelectedTrackingTypeId(trackingTypeId);
    setShowDropdown(false);
  };

  const handleSave = () => {
    if (selectedTrackingType) {
      const payload: CreateTrackingRecordPayload = {
        user_id: userId,
        tracking_type_id: selectedTrackingType.id,
        event_at: selectedDateTime.toISOString(),
        note: notes.trim() || null, // Send null if notes is empty
      };

      // Call the legacy callback if provided
      onSave?.({
        trackingTypeId: selectedTrackingType.id,
        dateTime: selectedDateTime,
        notes: notes.trim(),
      });

      // Make the API call
      createRecordMutation.mutate(payload);
    }
  };

  const isSaveDisabled =
    !selectedTrackingType || createRecordMutation.isPending;

  if (!trackingTypes || trackingTypes.length === 0) {
    return null; // Don't render if no tracking types available
  }

  return (
    <AppSurface style={styles.card}>
      <View style={styles.header}>
        <AppText tone="secondary" style={styles.trackingTypeLabel}>
          Tracking Type
        </AppText>
        <Pressable
          style={styles.dropdownContainer}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <AppText variant="heading" style={styles.selectedTrackingType}>
            {selectedTrackingType?.displayName || 'Select tracking type'}
          </AppText>
          <AppText
            variant="caption"
            tone="secondary"
            style={styles.dropdownArrow}
          >
            {showDropdown ? '▲' : '▼'}
          </AppText>
        </Pressable>

        {showDropdown && (
          <View style={styles.dropdown}>
            {trackingTypes.map(type => (
              <Pressable
                key={type.id}
                style={[
                  styles.dropdownItem,
                  type.id === selectedTrackingTypeId &&
                    styles.dropdownItemSelected,
                ]}
                onPress={() => handleTrackingTypeSelect(type.id)}
              >
                <AppText
                  style={[
                    styles.dropdownItemText,
                    type.id === selectedTrackingTypeId &&
                      styles.dropdownItemTextSelected,
                  ]}
                >
                  {type.displayName}
                </AppText>
                <AppText
                  variant="caption"
                  tone="secondary"
                  style={styles.dropdownItemDescription}
                >
                  {type.description}
                </AppText>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.dateTimeSection}>
        <AppText tone="secondary" style={styles.dateTimeLabel}>
          Date & Time
        </AppText>

        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeDisplay}>
            <AppText variant="body" style={styles.dateTimeText}>
              {formatDateTime(selectedDateTime)}
            </AppText>
            <AppText
              variant="caption"
              tone="secondary"
              style={styles.clickableHint}
            >
              {showDateTimePicker
                ? pickerMode === 'date'
                  ? 'Select date, then time'
                  : 'Select time to finish'
                : 'Tap button to change'}
            </AppText>
          </View>

          <AppButton
            label={showDateTimePicker ? 'Done' : 'Change'}
            variant="outline"
            size="sm"
            onPress={
              showDateTimePicker
                ? () => setShowDateTimePicker(false)
                : handleDateTimePress
            }
            style={styles.changeDateTimeButton}
          />
        </View>

        {/* Combined Date/Time Picker */}
        {showDateTimePicker && (
          <View style={styles.pickerContainer}>
            <AppText
              variant="caption"
              tone="secondary"
              style={styles.pickerModeLabel}
            >
              {pickerMode === 'date' ? '📅 Select Date' : '⏰ Select Time'}
            </AppText>
            <DateTimePicker
              value={selectedDateTime}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={handleDateTimeChange}
              style={styles.picker}
            />
            {Platform.OS === 'ios' && pickerMode === 'date' && (
              <AppButton
                label="Next: Set Time"
                variant="outline"
                size="sm"
                onPress={() => setPickerMode('time')}
                style={styles.nextButton}
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.notesContainer}>
        <AppText tone="secondary" style={styles.notesLabel}>
          Notes
        </AppText>
        <AppTextInput
          value={notes}
          onChangeText={handleNotesChange}
          placeholder="Write how you feel..."
          multiline
          numberOfLines={4}
          style={styles.notesInput}
          textAlignVertical="top"
        />
        <View style={styles.charCountContainer}>
          <AppText
            variant="caption"
            tone={remainingChars < 50 ? 'primary' : 'secondary'}
            style={styles.charCount}
          >
            {remainingChars} characters remaining
          </AppText>
        </View>
      </View>

      <AppButton
        label={createRecordMutation.isPending ? 'Saving...' : 'Save Entry'}
        onPress={handleSave}
        disabled={isSaveDisabled}
        fullWidth
        style={styles.saveButton}
        textStyle={styles.saveButtonText}
      />
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg, // Reduced from xl since ScrollView has content padding
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  trackingTypeLabel: {
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLOR_PALETTE.accentMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  selectedTrackingType: {
    color: COLOR_PALETTE.textPrimary,
    flex: 1,
  },
  dropdownArrow: {
    marginLeft: SPACING.sm,
  },
  dropdown: {
    marginTop: SPACING.xs,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  dropdownItemSelected: {
    backgroundColor: COLOR_PALETTE.accentMuted,
  },
  dropdownItemText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  dropdownItemTextSelected: {
    color: COLOR_PALETTE.accentPrimary,
  },
  dropdownItemDescription: {
    fontSize: 12,
  },
  trackingType: {
    color: COLOR_PALETTE.textPrimary,
  },
  dateTimeSection: {
    marginBottom: SPACING.lg,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  dateTimeDisplay: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLOR_PALETTE.accentMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  dateTimeButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  changeDateTimeButton: {
    minWidth: 80,
  },
  pickerModeLabel: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  nextButton: {
    marginTop: SPACING.md,
  },
  pickerContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    alignItems: 'center',
  },
  picker: {
    backgroundColor: 'transparent',
  },
  dateTimeLabel: {
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  dateTimeText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  clickableHint: {
    fontStyle: 'italic',
    fontSize: 11,
  },
  notesContainer: {
    marginBottom: SPACING.lg,
  },
  notesLabel: {
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  notesInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 8,
    padding: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: SPACING.xs,
  },
  charCount: {
    fontSize: 11,
  },
  saveButton: {
    marginTop: SPACING.sm,
    backgroundColor: BRAND_COLORS.cream,
    borderColor: BRAND_COLORS.cream,
  },
  saveButtonText: {
    color: BRAND_COLORS.ink,
  },
});
