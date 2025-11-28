import React, {
  useState,
  useRef,
  RefObject,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMutation } from '@tanstack/react-query';

import { AppSurface, AppText, AppTextInput } from '@/shared/components/ui';
import {
  COLOR_PALETTE,
  SPACING,
  BRAND_COLORS,
  BORDER_RADIUS,
} from '@/shared/theme';
import {
  useTrackingTypes,
  useInfiniteTrackingRecords,
} from '@/features/tracking';
import {
  createTrackingRecord,
  CreateTrackingRecordPayload,
} from '@/features/tracking/api/createTrackingRecord';
import { updateTrackingRecord } from '@/features/tracking/api/updateTrackingRecord';
import type { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import { useToast } from '@/shared/components/toast';
import { useCurrentUserId } from '@/features/tracking/hooks/useCurrentUserId';
import CalendarIcon from '@/assets/calendar.svg';
import { formatRelativeDateTimeForDisplay } from '@/utils/timezoneUtils';
import ScrollManager from '@/utils/scrollManager';

export type NotesCardHandle = {
  save: () => void;
};

type NotesCardProps = {
  userId?: number;
  recordId?: number;
  initialValues?: {
    trackingTypeId: number;
    dateTime: Date;
    notes: string;
  };
  onSave?: (data: {
    trackingTypeId: number;
    dateTime: Date;
    notes: string;
  }) => void;
  onSaveSuccess?: () => void;
  scrollViewRef?: RefObject<ScrollView | null>;
};

export const NotesCard = forwardRef<NotesCardHandle, NotesCardProps>(
  (
    { userId, recordId, initialValues, onSave, onSaveSuccess, scrollViewRef },
    ref,
  ) => {
    const currentUserId = useCurrentUserId();
    const actualUserId = userId ?? currentUserId;
    const { data: trackingTypes } = useTrackingTypes();
    const { showToast } = useToast();
    const { addRecordToCache, replaceOptimisticRecord, updateRecordInCache } =
      useInfiniteTrackingRecords();
    const [selectedTrackingTypeId, setSelectedTrackingTypeId] = useState<
      number | null
    >(initialValues?.trackingTypeId ?? null);
    const [selectedDateTime, setSelectedDateTime] = useState(
      initialValues?.dateTime ?? new Date(),
    );
    const [notes, setNotes] = useState(initialValues?.notes ?? '');
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    // Add ref for the NotesCard component
    const cardRef = useRef<View>(null);

    // Update state when initialValues change
    React.useEffect(() => {
      if (initialValues) {
        setSelectedTrackingTypeId(initialValues.trackingTypeId);
        setSelectedDateTime(initialValues.dateTime);
        setNotes(initialValues.notes);
      }
    }, [initialValues]);

    // Cleanup scroll operations when component unmounts
    React.useEffect(() => {
      return () => {
        ScrollManager.cancelCurrent();
      };
    }, []);

    // Mutation for creating tracking record
    const createRecordMutation = useMutation({
      mutationFn: createTrackingRecord,
      onMutate: async (variables: CreateTrackingRecordPayload) => {
        // Generate a temporary ID for the optimistic update
        const tempId = Date.now(); // Use timestamp as temp ID

        // Create optimistic record that matches API response format
        const optimisticRecord: TrackingRecordApiResponse = {
          record_id: tempId,
          user_id: variables.user_id,
          tracking_type_id: variables.tracking_type_id,
          event_at: variables.event_at,
          note: variables.note || null,
        };

        // Optimistically add the record to the cache
        addRecordToCache(optimisticRecord);

        return { optimisticRecord, tempId };
      },
      onSuccess: (realRecord, _variables, context) => {
        // Replace the optimistic record with the real record from server
        if (context?.tempId) {
          replaceOptimisticRecord(context.tempId, realRecord);
        }

        // Reset form
        setNotes('');
        setSelectedDateTime(new Date());
        setShowDateTimePicker(false);

        // Call success callback
        onSaveSuccess?.();

        // Show success message
        showToast('Your tracking entry has been saved!', 'success');
      },
      onError: (error, _variables, _context) => {
        // On error, the optimistic update will be automatically reverted
        // No need to manually invalidate queries
        showToast(
          error instanceof Error
            ? error.message
            : 'Failed to save tracking entry',
          'error',
        );
      },
    });

    // Mutation for updating tracking record
    const updateRecordMutation = useMutation({
      mutationFn: ({ recordId, payload }: { recordId: number; payload: any }) =>
        updateTrackingRecord(recordId, payload),
      onMutate: async ({ recordId, payload }) => {
        // Optimistically update the record in the cache
        // We need the original record to construct the full object, but we don't have it here easily.
        // However, updateRecordInCache only needs the ID and the updated fields if we were merging,
        // but the implementation replaces the record if ID matches.
        // Wait, updateRecordInCache implementation:
        // record.record_id === updatedRecord.record_id ? updatedRecord : record
        // So we need the FULL record.
        // We can construct a partial one, but that might break things if fields are missing.
        // But we have all fields: user_id, tracking_type_id, event_at, note.
        // We just need to make sure we have user_id.

        const updatedRecord: TrackingRecordApiResponse = {
          record_id: recordId,
          user_id: actualUserId!, // We assume user is logged in
          tracking_type_id: payload.tracking_type_id,
          event_at: payload.event_at,
          note: payload.note || null,
        };
        updateRecordInCache(updatedRecord);
        return { recordId };
      },
      onSuccess: () => {
        onSaveSuccess?.();
        showToast('Your tracking entry has been updated!', 'success');
      },
      onError: (error, _variables, _context) => {
        showToast(
          error instanceof Error
            ? error.message
            : 'Failed to update tracking entry',
          'error',
        );
      },
    });

    const sortedTrackingTypes = React.useMemo(() => {
      if (!trackingTypes) return [];
      return [...trackingTypes].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      );
    }, [trackingTypes]);

    React.useEffect(() => {
      if (
        sortedTrackingTypes &&
        sortedTrackingTypes.length > 0 &&
        selectedTrackingTypeId === null
      ) {
        const defaultType = sortedTrackingTypes.find(type => type.is_default);
        if (defaultType) {
          setSelectedTrackingTypeId(defaultType.id);
        } else {
          setSelectedTrackingTypeId(sortedTrackingTypes[0].id);
        }
      }
    }, [sortedTrackingTypes, selectedTrackingTypeId]);

    const selectedTrackingType = sortedTrackingTypes?.find(
      type => type.id === selectedTrackingTypeId,
    );

    const maxChars = 500;
    const remainingChars = maxChars - notes.length;

    const handleDateTimePress = () => {
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

          // Check if the selected time is in the future for today's date
          const now = new Date();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDateOnly = new Date(newDateTime);
          selectedDateOnly.setHours(0, 0, 0, 0);

          if (
            selectedDateOnly.getTime() === today.getTime() &&
            newDateTime > now
          ) {
            // If it's today and the time is in the future, don't update and show a warning
            showToast('Cannot select a future time for today', 'error');
            return;
          }

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
      if (text.length <= maxChars) {
        setNotes(text);
      }
    };

    const handleNotesFocus = () => {
      // Use ScrollManager to ensure only one scroll operation at a time
      ScrollManager.scheduleScroll(() => {
        ScrollManager.scrollCardToPosition(cardRef, scrollViewRef, 0.2);
      }, 50); // Shorter delay for focus events
    };

    const handleTrackingTypeSelect = (trackingTypeId: number) => {
      setSelectedTrackingTypeId(trackingTypeId);
    };

    const handleSave = () => {
      if (selectedTrackingType) {
        const payload = {
          user_id: actualUserId,
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

        if (recordId) {
          updateRecordMutation.mutate({
            recordId,
            payload: {
              tracking_type_id: selectedTrackingType.id,
              event_at: selectedDateTime.toISOString(),
              note: notes.trim() || undefined,
            },
          });
        } else {
          // Make the API call
          createRecordMutation.mutate(payload);
        }
      }
    };

    // Expose the save method to the parent component
    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    if (!sortedTrackingTypes || sortedTrackingTypes.length === 0) {
      return null;
    }

    return (
      <View ref={cardRef}>
        <AppSurface style={styles.card}>
          {/* Tracking Type Selector - Chips/Segmented Control Style */}
          <View style={styles.typeSelectorContainer}>
            <AppText variant="caption" style={styles.sectionLabel}>
              I am logging a...
            </AppText>
            <View style={styles.chipContainer}>
              {sortedTrackingTypes.map(type => {
                const isSelected = selectedTrackingTypeId === type.id;
                return (
                  <Pressable
                    key={type.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => handleTrackingTypeSelect(type.id)}
                  >
                    <AppText
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {type.displayName}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Date Time Selector */}
          <View style={styles.dateTimeSection}>
            <AppText variant="caption" style={styles.sectionLabel}>
              When did it happen?
            </AppText>
            <Pressable
              style={styles.dateTimeButton}
              onPress={
                showDateTimePicker
                  ? () => setShowDateTimePicker(false)
                  : handleDateTimePress
              }
            >
              <CalendarIcon
                width={20}
                height={20}
                // fill={BRAND_COLORS.cream}
                style={styles.calendarIcon}
              />
              <AppText
                variant="body"
                tone="primary"
                style={styles.dateTimeText}
              >
                {formatRelativeDateTimeForDisplay(
                  selectedDateTime.toISOString(),
                )}
              </AppText>
            </Pressable>
          </View>

          {/* Notes Input */}
          <View style={styles.notesContainer}>
            <AppText variant="caption" style={styles.sectionLabel}>
              Notes (Optional)
            </AppText>
            <AppTextInput
              value={notes}
              onChangeText={handleNotesChange}
              onFocus={handleNotesFocus}
              placeholder="How are you feeling? What triggered this?"
              multiline
              numberOfLines={6}
              style={styles.notesInput}
              textAlignVertical="top"
            />
            <View style={styles.charCountContainer}>
              <AppText variant="subcaption" tone="primary">
                {remainingChars} characters remaining
              </AppText>
            </View>
          </View>

          {showDateTimePicker && (
            <DateTimePicker
              value={selectedDateTime}
              mode={pickerMode}
              is24Hour={false}
              maximumDate={new Date()}
              onChange={handleDateTimeChange}
            />
          )}
        </AppSurface>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg, // Increased padding
  },
  sectionLabel: {
    marginBottom: SPACING.sm,
    color: COLOR_PALETTE.textMuted,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  typeSelectorContainer: {
    marginBottom: SPACING.xl,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  chipSelected: {
    backgroundColor: BRAND_COLORS.cream,
    borderColor: BRAND_COLORS.cream,
  },
  chipText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: BRAND_COLORS.ink,
    fontWeight: '600',
  },
  dateTimeSection: {
    marginBottom: SPACING.xl,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
  },
  calendarIcon: {
    marginRight: SPACING.sm,
  },
  dateTimeText: {
    flex: 1,
  },
  editIndicator: {
    backgroundColor: COLOR_PALETTE.accentMuted,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editIndicatorText: {
    color: BRAND_COLORS.cream,
    fontSize: 10,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginBottom: SPACING.sm,
  },
  notesInput: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLOR_PALETTE.textPrimary,
    minHeight: 120, // Increased height
    textAlignVertical: 'top',
    marginBottom: SPACING.xs,
    fontSize: 16, // Slightly larger text
  },
  charCountContainer: {
    alignItems: 'flex-end',
  },
});
