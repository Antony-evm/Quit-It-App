import React, { useState, useRef, RefObject } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
  ScrollView,
  Dimensions,
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
  SURFACE_VARIANTS,
  LAYOUT_STYLES,
  TEXT_STYLES,
  getSurfaceVariant,
  SHADOWS,
} from '@/shared/styles/commonStyles';
import { useTrackingTypes } from '@/features/tracking';
import { useInfiniteTrackingRecords } from '@/features/tracking';
import {
  createTrackingRecord,
  CreateTrackingRecordPayload,
} from '@/features/tracking/api/createTrackingRecord';
import type { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import { useToast } from '@/shared/components/toast';
import { useCurrentUserId } from '@/features/tracking/hooks/useCurrentUserId';
import ArrowDownSvg from '@/assets/arrowDown.svg';
import ArrowUpSvg from '@/assets/arrowUp.svg';
import CheckmarkSvg from '@/assets/checkmark.svg';
import { formatRelativeDateTimeForDisplay } from '@/utils/timezoneUtils';
import ScrollManager from '@/utils/scrollManager';

type NotesCardProps = {
  userId?: number;
  onSave?: (data: {
    trackingTypeId: number;
    dateTime: Date;
    notes: string;
  }) => void;
  onSaveSuccess?: () => void;
  scrollViewRef?: RefObject<ScrollView | null>;
};

export const NotesCard: React.FC<NotesCardProps> = ({
  userId,
  onSave,
  onSaveSuccess,
  scrollViewRef,
}) => {
  const currentUserId = useCurrentUserId();
  const actualUserId = userId ?? currentUserId;
  const { data: trackingTypes } = useTrackingTypes();
  const { showToast } = useToast();
  const { addRecordToCache, replaceOptimisticRecord } =
    useInfiniteTrackingRecords();
  const [selectedTrackingTypeId, setSelectedTrackingTypeId] = useState<
    number | null
  >(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  // Add ref for the NotesCard component
  const cardRef = useRef<View>(null);

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
      setShowDropdown(false);

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

  React.useEffect(() => {
    if (
      trackingTypes &&
      trackingTypes.length > 0 &&
      selectedTrackingTypeId === null
    ) {
      const defaultType = trackingTypes.find(type => type.is_default);
      if (defaultType) {
        setSelectedTrackingTypeId(defaultType.id);
      } else {
        setSelectedTrackingTypeId(trackingTypes[0].id);
      }
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
    setShowDropdown(false); // Close dropdown when typing in notes
    if (text.length <= maxChars) {
      setNotes(text);
    }
  };

  // Helper function to scroll card to 20% from top of screen
  const scrollCardToPosition = () => {
    ScrollManager.scrollCardToPosition(cardRef, scrollViewRef, 0.2);
  };

  const handleNotesFocus = () => {
    // Use ScrollManager to ensure only one scroll operation at a time
    ScrollManager.scheduleScroll(() => {
      ScrollManager.scrollCardToPosition(cardRef, scrollViewRef, 0.2);
    }, 50); // Shorter delay for focus events
  };

  const handleTrackingTypeSelect = (trackingTypeId: number) => {
    setSelectedTrackingTypeId(trackingTypeId);
    setShowDropdown(false);
  };

  const handleSave = () => {
    if (selectedTrackingType) {
      const payload: CreateTrackingRecordPayload = {
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

      // Make the API call
      createRecordMutation.mutate(payload);
    }
  };

  if (!trackingTypes || trackingTypes.length === 0) {
    return null;
  }

  return (
    <View ref={cardRef}>
      <AppSurface style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.dropdownContainer}>
            <Pressable
              style={[styles.dropdown]}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <AppText style={[styles.dropdownText, styles.headerDropdownText]}>
                {selectedTrackingType?.displayName || 'Select tracking type'}
              </AppText>
              {showDropdown ? (
                <ArrowUpSvg width={16} height={16} fill={BRAND_COLORS.cream} />
              ) : (
                <ArrowDownSvg
                  width={16}
                  height={16}
                  fill={BRAND_COLORS.cream}
                />
              )}
            </Pressable>
            {showDropdown && trackingTypes && (
              <View style={styles.dropdownList}>
                {trackingTypes.map(type => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.dropdownItem,
                      selectedTrackingTypeId === type.id &&
                        styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleTrackingTypeSelect(type.id)}
                  >
                    <AppText
                      style={[
                        styles.dropdownItemText,
                        selectedTrackingTypeId === type.id &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {type.displayName}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          <View>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleSave}
              disabled={createRecordMutation.isPending}
            >
              <CheckmarkSvg width={24} height={24} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.dateTimeSection]}>
          <Pressable
            style={styles.dateTimeButton}
            onPress={
              showDateTimePicker
                ? () => setShowDateTimePicker(false)
                : handleDateTimePress
            }
          >
            <AppText variant="caption" tone="primary">
              {formatRelativeDateTimeForDisplay(selectedDateTime.toISOString())}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.notesContainer}>
          <AppTextInput
            value={notes}
            onChangeText={handleNotesChange}
            onFocus={handleNotesFocus}
            placeholder="What's on your mind?"
            multiline
            numberOfLines={4}
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
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md, // Reduced from xl since ScrollView has content padding
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  trackingTypeLabel: {
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  dateTimeButton: {
    marginHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.cream,
    borderStyle: 'dashed',
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
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,

    ...LAYOUT_STYLES.rowBetween,
  },
  dropdownText: {
    ...TEXT_STYLES.dropdownText,
  },
  headerDropdownText: {
    ...TEXT_STYLES.dropdownText,
  },
  dropdownList: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    ...LAYOUT_STYLES.dropdownList,
  },
  dropdownItem: {
    ...LAYOUT_STYLES.dropdownItem,
  },
  dropdownItemSelected: {
    ...LAYOUT_STYLES.dropdownItemSelected,
  },
  dropdownItemText: {
    ...TEXT_STYLES.dropdownItemText,
  },
  dropdownItemTextSelected: {
    ...TEXT_STYLES.dropdownItemTextSelected,
  },
  trackingType: {
    color: COLOR_PALETTE.textPrimary,
  },
  dateTimeSection: {
    marginBottom: SPACING.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  notesContainer: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  notesInput: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLOR_PALETTE.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.xs,
  },
  charCountContainer: {
    alignItems: 'flex-end',
  },
  saveButton: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: BRAND_COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
