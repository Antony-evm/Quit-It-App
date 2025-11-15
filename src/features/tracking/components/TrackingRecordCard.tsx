import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMutation } from '@tanstack/react-query';
import EditSvg from '@/assets/edit.svg';
import DeleteSvg from '@/assets/delete.svg';

import {
  AppSurface,
  AppText,
  AppTextInput,
  AppButton,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BRAND_COLORS } from '@/shared/theme';
import { useTrackingTypes } from '../hooks/useTrackingTypes';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import type { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';
import { updateTrackingRecord } from '../api/updateTrackingRecord';
import { deleteTrackingRecord } from '../api/deleteTrackingRecord';
import { useToast } from '@/shared/components/toast';
import {
  formatRelativeDateTimeForDisplay,
  parseTimestampFromAPI,
} from '@/utils/timezoneUtils';

type TrackingRecordCardProps = {
  record: TrackingRecordApiResponse;
};

export const TrackingRecordCard: React.FC<TrackingRecordCardProps> = ({
  record,
}) => {
  const { data: trackingTypes } = useTrackingTypes();
  const { showToast } = useToast();
  const { updateRecordInCache, removeRecordFromCache } =
    useInfiniteTrackingRecords();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState(record.note || '');
  const [editedDateTime, setEditedDateTime] = useState(
    parseTimestampFromAPI(record.event_at),
  );
  const [editedTrackingTypeId, setEditedTrackingTypeId] = useState(
    record.tracking_type_id,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  // Ensure we have a valid tracking type ID, fallback to default if needed
  React.useEffect(() => {
    if (trackingTypes && trackingTypes.length > 0) {
      // Check if current tracking type ID is valid
      const currentTypeExists = trackingTypes.find(
        type => type.id === editedTrackingTypeId,
      );

      // If the current tracking type doesn't exist or is null/undefined,
      // set to default or first available
      if (!currentTypeExists || editedTrackingTypeId == null) {
        const defaultType = trackingTypes.find(type => type.is_default);
        if (defaultType) {
          setEditedTrackingTypeId(defaultType.id);
        } else {
          // Fallback to the first tracking type if no default is found
          setEditedTrackingTypeId(trackingTypes[0].id);
        }
      }
    }
  }, [trackingTypes, editedTrackingTypeId]);

  const trackingType = trackingTypes?.find(
    type => type.id === record.tracking_type_id,
  );
  const editedTrackingType = trackingTypes?.find(
    type => type.id === editedTrackingTypeId,
  );

  const formattedDate = formatRelativeDateTimeForDisplay(record.event_at);
  const maxChars = 500;
  const remainingChars = maxChars - editedNote.length;

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowDateTimePicker(false);
    }

    if (selectedDate) {
      setEditedDateTime(selectedDate);

      if (Platform.OS === 'ios' && pickerMode === 'date') {
        // On iOS, show time picker after date is selected
        setPickerMode('time');
      } else {
        setShowDateTimePicker(false);
        setPickerMode('date');
      }
    }
  };

  const showDateTimePickerModal = () => {
    setPickerMode('date');
    setShowDateTimePicker(true);
  };

  // Mutations for updating and deleting tracking records
  const updateRecordMutation = useMutation({
    mutationFn: ({ recordId, payload }: { recordId: number; payload: any }) =>
      updateTrackingRecord(recordId, payload),
    onMutate: async ({ recordId, payload }) => {
      // Optimistically update the record in the cache
      const updatedRecord: TrackingRecordApiResponse = {
        ...record,
        event_at: payload.event_at,
        note: payload.note || null,
        tracking_type_id: payload.tracking_type_id,
      };
      updateRecordInCache(updatedRecord);
      return { recordId, originalRecord: record };
    },
    onSuccess: () => {
      setIsEditMode(false);
      showToast('Your tracking entry has been updated!', 'success');
    },
    onError: (error, _variables, _context) => {
      // On error, optimistic update will be automatically reverted
      // No need to manually invalidate queries
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to update tracking entry',
        'error',
      );
    },
  });

  const deleteRecordMutation = useMutation({
    mutationFn: deleteTrackingRecord,
    onMutate: async recordId => {
      // Optimistically remove the record from the cache
      removeRecordFromCache(recordId);
      return { recordId };
    },
    onSuccess: () => {
      showToast('Tracking entry has been deleted!', 'success');
    },
    onError: (error, _recordId, _context) => {
      // On error, optimistic update will be automatically reverted
      // No need to manually invalidate queries
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to delete tracking entry',
        'error',
      );
    },
  });

  const handleSave = () => {
    const payload = {
      event_at: editedDateTime.toISOString(),
      note: editedNote.trim() || undefined,
      tracking_type_id: editedTrackingTypeId,
    };

    updateRecordMutation.mutate({
      recordId: record.record_id,
      payload,
    });
  };

  const handleDelete = () => {
    deleteRecordMutation.mutate(record.record_id);
  };

  const handleCancel = () => {
    // Reset form values to original
    setEditedNote(record.note || '');
    setEditedDateTime(parseTimestampFromAPI(record.event_at));

    // Reset tracking type ID, but ensure it's valid
    if (trackingTypes && trackingTypes.length > 0) {
      const originalTypeExists = trackingTypes.find(
        type => type.id === record.tracking_type_id,
      );

      if (originalTypeExists && record.tracking_type_id != null) {
        setEditedTrackingTypeId(record.tracking_type_id);
      } else {
        // Fallback to default if original type is invalid
        const defaultType = trackingTypes.find(type => type.is_default);
        if (defaultType) {
          setEditedTrackingTypeId(defaultType.id);
        } else {
          setEditedTrackingTypeId(trackingTypes[0].id);
        }
      }
    } else {
      setEditedTrackingTypeId(record.tracking_type_id);
    }

    setIsEditMode(false);
    setShowDropdown(false);
    setShowDateTimePicker(false);
  };

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  if (isEditMode) {
    return (
      <AppSurface style={styles.card}>
        <View style={styles.editHeader}>
          <AppText variant="heading" style={styles.editTitle}>
            Edit Entry
          </AppText>
        </View>

        {/* Tracking Type Dropdown */}
        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            Type
          </AppText>
          <Pressable
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <AppText style={styles.dropdownText}>
              {editedTrackingType?.displayName || 'Select tracking type'}
            </AppText>
            <AppText style={styles.dropdownArrow}>▼</AppText>
          </Pressable>

          {showDropdown && trackingTypes && (
            <View style={styles.dropdownList}>
              {trackingTypes.map(type => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.dropdownItem,
                    editedTrackingTypeId === type.id &&
                      styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setEditedTrackingTypeId(type.id);
                    setShowDropdown(false);
                  }}
                >
                  <AppText
                    style={[
                      styles.dropdownItemText,
                      editedTrackingTypeId === type.id &&
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

        {/* Date/Time Section */}
        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            Date & Time
          </AppText>
          <Pressable
            style={styles.dateTimeButton}
            onPress={showDateTimePickerModal}
          >
            <AppText style={styles.dateTimeText}>
              {formatDateTime(editedDateTime)}
            </AppText>
          </Pressable>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            Notes (Optional)
          </AppText>
          <AppTextInput
            style={styles.notesInput}
            placeholder="Add your notes here..."
            value={editedNote}
            onChangeText={setEditedNote}
            multiline
            maxLength={maxChars}
            placeholderTextColor={COLOR_PALETTE.textSecondary}
          />
          <AppText variant="caption" tone="secondary" style={styles.charCount}>
            {remainingChars} characters remaining
          </AppText>
        </View>

        {/* Edit Mode Buttons */}
        <View style={styles.editActions}>
          <AppButton
            label="Cancel"
            variant="outline"
            size="sm"
            onPress={handleCancel}
            containerStyle={styles.cancelButton}
          />
          <AppButton
            label="Save"
            variant="primary"
            size="sm"
            onPress={handleSave}
            containerStyle={styles.saveButton}
          />
        </View>

        {/* Date Time Picker */}
        {showDateTimePicker && (
          <DateTimePicker
            value={editedDateTime}
            mode={pickerMode}
            is24Hour={false}
            maximumDate={new Date()}
            onChange={handleDateTimeChange}
          />
        )}
      </AppSurface>
    );
  }

  return (
    <AppSurface style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <AppText variant="heading" style={styles.trackingTypeName}>
            {trackingType?.displayName || `Type ${record.tracking_type_id}`}
          </AppText>
          <View style={styles.actionButtons}>
            <Pressable style={styles.editButton} onPress={handleEditPress}>
              <EditSvg width={18} height={18} fill={BRAND_COLORS.ink} />
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <DeleteSvg width={18} height={18} fill="#F87171" />
            </Pressable>
          </View>
        </View>
        <AppText variant="caption" tone="secondary" style={styles.dateTime}>
          {formattedDate}
        </AppText>
      </View>

      {record.note && (
        <View style={styles.noteSection}>
          <AppText variant="body" style={styles.noteText}>
            {record.note}
          </AppText>
        </View>
      )}
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  header: {
    gap: SPACING.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackingTypeName: {
    color: COLOR_PALETTE.textPrimary,
    flex: 1,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateTime: {
    fontSize: 12,
  },
  noteSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.borderDefault,
  },
  noteText: {
    color: COLOR_PALETTE.textPrimary,
    fontStyle: 'italic',
  },
  // Edit mode styles
  editHeader: {
    marginBottom: SPACING.md,
  },
  editTitle: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    color: COLOR_PALETTE.textPrimary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  dropdownText: {
    color: COLOR_PALETTE.textPrimary,
    flex: 1,
  },
  dropdownArrow: {
    color: COLOR_PALETTE.textSecondary,
    fontSize: 12,
  },
  dropdownList: {
    marginTop: SPACING.xs,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    maxHeight: 150,
  },
  dropdownItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  dropdownItemSelected: {
    backgroundColor: COLOR_PALETTE.accentMuted,
  },
  dropdownItemText: {
    color: COLOR_PALETTE.textPrimary,
  },
  dropdownItemTextSelected: {
    color: COLOR_PALETTE.accentPrimary,
    fontWeight: '600',
  },
  dateTimeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  dateTimeText: {
    color: COLOR_PALETTE.textPrimary,
  },
  notesInput: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLOR_PALETTE.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
