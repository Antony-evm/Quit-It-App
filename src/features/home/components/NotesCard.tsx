import React, {
  useState,
  useRef,
  RefObject,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
  AppSurface,
  AppText,
  AppTextInput,
  AppPressable,
  AppIcon,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';
import { useQueryClient } from '@tanstack/react-query';
import {
  useTrackingTypes,
  useInfiniteTrackingRecords,
} from '@/features/tracking';
import { useTrackingMutations } from '@/features/tracking/hooks/useTrackingMutations';
import type { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import { useToast } from '@/shared/components/toast';
import { useCurrentUserId } from '@/features/tracking/hooks/useCurrentUserId';
import { formatRelativeDateTimeForDisplay } from '@/utils/timezoneUtils';
import ScrollManager from '@/utils/scrollManager';
import CalendarIcon from '@/assets/calendar.svg';

export type NotesCardHandle = {
  save: () => void;
  delete: () => void;
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
  onDeleteSuccess?: () => void;
  scrollViewRef?: RefObject<ScrollView | null>;
};

export const NotesCard = forwardRef<NotesCardHandle, NotesCardProps>(
  (
    {
      userId,
      recordId,
      initialValues,
      onSave,
      onSaveSuccess,
      onDeleteSuccess,
      scrollViewRef,
    },
    ref,
  ) => {
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();
    const actualUserId = userId ?? currentUserId;
    const { data: trackingTypes } = useTrackingTypes();
    const { showToast } = useToast();
    const {
      addRecordToCache,
      replaceOptimisticRecord,
      updateRecordInCache,
      removeRecordFromCache,
    } = useInfiniteTrackingRecords();
    const {
      create,
      update,
      delete: deleteMutation,
    } = useTrackingMutations(actualUserId);

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

    const isCraving = selectedTrackingType?.displayName
      .toLowerCase()
      .includes('craving');
    const isSmoke =
      selectedTrackingType?.displayName.toLowerCase().includes('smoke') ||
      selectedTrackingType?.displayName.toLowerCase().includes('cigarette');

    const accentColor = isCraving
      ? COLOR_PALETTE.craving
      : isSmoke
      ? COLOR_PALETTE.cigarette
      : COLOR_PALETTE.borderDefault;

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
        if (initialValues) {
          const isSame =
            selectedTrackingTypeId === initialValues.trackingTypeId &&
            selectedDateTime.getTime() === initialValues.dateTime.getTime() &&
            notes === initialValues.notes;

          if (isSame) {
            onSaveSuccess?.();
            return;
          }
        }

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
          const oldRecord: TrackingRecordApiResponse | undefined = initialValues
            ? {
                record_id: recordId,
                user_id: actualUserId!,
                tracking_type_id: initialValues.trackingTypeId,
                event_at: initialValues.dateTime.toISOString(),
                note: initialValues.notes || null,
              }
            : undefined;

          const updatedRecord: TrackingRecordApiResponse = {
            record_id: recordId,
            user_id: actualUserId!, // We assume user is logged in
            tracking_type_id: selectedTrackingType.id,
            event_at: selectedDateTime.toISOString(),
            note: notes.trim() || null,
          };

          // Optimistic update
          updateRecordInCache(updatedRecord);

          update.mutate(
            {
              record_id: recordId,
              data: {
                tracking_type_id: selectedTrackingType.id,
                event_at: selectedDateTime.toISOString(),
                note: notes.trim() || undefined,
              },
              oldRecord,
            },
            {
              onSuccess: () => {
                onSaveSuccess?.();
                showToast('Your tracking entry has been updated!', 'success');
                queryClient.invalidateQueries({
                  queryKey: ['cravingAnalytics', actualUserId],
                });
                queryClient.invalidateQueries({
                  queryKey: ['smokingAnalytics', actualUserId],
                });
              },
              onError: error => {
                // Rollback
                if (oldRecord) {
                  updateRecordInCache(oldRecord);
                }
                showToast(
                  error instanceof Error
                    ? error.message
                    : 'Failed to update tracking entry',
                  'error',
                );
              },
            },
          );
        } else {
          // Make the API call
          // Generate a temporary ID for the optimistic update
          const tempId = Date.now(); // Use timestamp as temp ID

          // Create optimistic record that matches API response format
          const optimisticRecord: TrackingRecordApiResponse = {
            record_id: tempId,
            user_id: payload.user_id,
            tracking_type_id: payload.tracking_type_id,
            event_at: payload.event_at,
            note: payload.note || null,
          };

          // Optimistically add the record to the cache
          addRecordToCache(optimisticRecord);

          create.mutate(payload, {
            onSuccess: realRecord => {
              // Replace the optimistic record with the real record from server
              replaceOptimisticRecord(tempId, realRecord);

              // Reset form
              setNotes('');
              setSelectedDateTime(new Date());
              setShowDateTimePicker(false);

              // Call success callback
              onSaveSuccess?.();

              // Show success message
              showToast('Your tracking entry has been saved!', 'success');

              queryClient.invalidateQueries({
                queryKey: ['cravingAnalytics', actualUserId],
              });
              queryClient.invalidateQueries({
                queryKey: ['smokingAnalytics', actualUserId],
              });
            },
            onError: error => {
              // On error, revert the optimistic update
              removeRecordFromCache(tempId);

              showToast(
                error instanceof Error
                  ? error.message
                  : 'Failed to save tracking entry',
                'error',
              );
            },
          });
        }
      }
    };

    const handleDelete = () => {
      if (recordId) {
        const recordToDelete: TrackingRecordApiResponse | undefined =
          initialValues
            ? {
                record_id: recordId,
                user_id: actualUserId!,
                tracking_type_id: initialValues.trackingTypeId,
                event_at: initialValues.dateTime.toISOString(),
                note: initialValues.notes || null,
              }
            : undefined;

        // Optimistic update
        removeRecordFromCache(recordId);

        deleteMutation.mutate(
          { recordId, record: recordToDelete },
          {
            onSuccess: () => {
              onDeleteSuccess?.();
              showToast('Tracking entry has been deleted!', 'success');
              queryClient.invalidateQueries({
                queryKey: ['cravingAnalytics', actualUserId],
              });
              queryClient.invalidateQueries({
                queryKey: ['smokingAnalytics', actualUserId],
              });
            },
            onError: error => {
              // Rollback
              if (recordToDelete) {
                addRecordToCache(recordToDelete);
              }
              showToast(
                error instanceof Error
                  ? error.message
                  : 'Failed to delete tracking entry',
                'error',
              );
            },
          },
        );
      }
    };

    // Expose the save method to the parent component
    useImperativeHandle(ref, () => ({
      save: handleSave,
      delete: handleDelete,
    }));

    if (!sortedTrackingTypes || sortedTrackingTypes.length === 0) {
      return null;
    }

    return (
      <View ref={cardRef}>
        <AppSurface
          style={[
            styles.card,
            { borderLeftColor: accentColor, borderLeftWidth: 4 },
          ]}
        >
          {/* Tracking Type Selector - Chips/Segmented Control Style */}
          <View style={styles.typeSelectorContainer}>
            <AppText variant="caption" style={styles.sectionLabel}>
              I am logging a...
            </AppText>
            <View style={styles.chipContainer}>
              {sortedTrackingTypes.map(type => {
                const isSelected = selectedTrackingTypeId === type.id;
                return (
                  <AppPressable
                    key={type.id}
                    variant="chip"
                    selected={isSelected}
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
                  </AppPressable>
                );
              })}
            </View>
          </View>

          {/* Date Time Selector */}
          <View style={styles.dateTimeSection}>
            <AppText variant="caption" style={styles.sectionLabel}>
              When did it happen?
            </AppText>
            <AppPressable
              variant="input"
              onPress={
                showDateTimePicker
                  ? () => setShowDateTimePicker(false)
                  : handleDateTimePress
              }
            >
              <AppIcon
                icon={CalendarIcon}
                variant="default"
                color={COLOR_PALETTE.textPrimary}
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
            </AppPressable>
          </View>

          {/* Notes Input */}
          <View style={styles.notesContainer}>
            <AppText variant="caption" style={styles.sectionLabel}>
              Notes (Optional)
            </AppText>
            <AppTextInput
              variant="primary"
              value={notes}
              onChangeText={handleNotesChange}
              onFocus={handleNotesFocus}
              placeholder="Every check-in counts. How are you feeling?"
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
  chipText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLOR_PALETTE.textSecondary,
    fontWeight: '600',
  },
  dateTimeSection: {
    marginBottom: SPACING.xl,
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
    color: COLOR_PALETTE.textPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginBottom: SPACING.sm,
  },
  notesInput: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    minHeight: 120, // Increased height
    marginBottom: SPACING.xs,
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: SPACING.md,
  },
  deleteContainer: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.borderDefault,
    paddingTop: SPACING.xl,
  },
  deleteButton: {
    borderColor: COLOR_PALETTE.systemError,
    backgroundColor: 'transparent',
    width: '100%',
  },
  deleteButtonText: {
    color: COLOR_PALETTE.systemError,
    fontWeight: '600',
  },
});
