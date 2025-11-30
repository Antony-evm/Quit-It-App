import React, {
  useState,
  useRef,
  RefObject,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, ScrollView } from 'react-native';
import { Box } from '@/shared/components/ui/Box';
import {
  AppCard,
  AppText,
  AppTextInput,
  AppDateTimePicker,
  AppTag,
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

    const cardRef = useRef<View>(null);

    React.useEffect(() => {
      if (initialValues) {
        setSelectedTrackingTypeId(initialValues.trackingTypeId);
        setSelectedDateTime(initialValues.dateTime);
        setNotes(initialValues.notes);
      }
    }, [initialValues]);
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

    const handleDateChange = (newDateTime: Date) => {
      // Check if the selected time is in the future for today's date
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateOnly = new Date(newDateTime);
      selectedDateOnly.setHours(0, 0, 0, 0);

      if (selectedDateOnly.getTime() === today.getTime() && newDateTime > now) {
        showToast('Cannot select a future time for today', 'error');
        return;
      }

      setSelectedDateTime(newDateTime);
    };

    const handleNotesChange = (text: string) => {
      if (text.length <= maxChars) {
        setNotes(text);
      }
    };

    const handleNotesFocus = () => {
      ScrollManager.scheduleScroll(() => {
        ScrollManager.scrollCardToPosition(cardRef, scrollViewRef, 0.2);
      }, 50);
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
          note: notes.trim() || null,
        };

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
            user_id: actualUserId!,
            tracking_type_id: selectedTrackingType.id,
            event_at: selectedDateTime.toISOString(),
            note: notes.trim() || null,
          };

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
          const tempId = Date.now();
          const optimisticRecord: TrackingRecordApiResponse = {
            record_id: tempId,
            user_id: payload.user_id,
            tracking_type_id: payload.tracking_type_id,
            event_at: payload.event_at,
            note: payload.note || null,
          };
          addRecordToCache(optimisticRecord);

          create.mutate(payload, {
            onSuccess: realRecord => {
              replaceOptimisticRecord(tempId, realRecord);

              setNotes('');
              setSelectedDateTime(new Date());
              onSaveSuccess?.();
              showToast('Your tracking entry has been saved!', 'success');

              queryClient.invalidateQueries({
                queryKey: ['cravingAnalytics', actualUserId],
              });
              queryClient.invalidateQueries({
                queryKey: ['smokingAnalytics', actualUserId],
              });
            },
            onError: error => {
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
        <AppCard
          variant="elevated"
          size="md"
          p="lg"
          style={[{ borderLeftColor: accentColor, borderLeftWidth: 4 }]}
        >
          <Box gap="sm">
            <AppText variant="subcaption" tone="muted">
              I am logging a...
            </AppText>
            <Box variant="chip">
              {sortedTrackingTypes.map(type => {
                const isSelected = selectedTrackingTypeId === type.id;
                return (
                  <AppTag
                    key={type.id}
                    label={type.displayName}
                    variant="rounded"
                    selected={isSelected}
                    onPress={() => handleTrackingTypeSelect(type.id)}
                  />
                );
              })}
            </Box>
          </Box>
          <Box>
            <AppDateTimePicker
              label="When did it happen?"
              value={selectedDateTime}
              onChange={handleDateChange}
              mode="datetime"
              maximumDate={new Date()}
              formatDisplay={date =>
                formatRelativeDateTimeForDisplay(date.toISOString())
              }
            />
          </Box>

          <Box gap="sm">
            <AppText variant="subcaption" tone="muted">
              Notes (Optional)
            </AppText>
            <AppTextInput
              variant="secondary"
              value={notes}
              onChangeText={handleNotesChange}
              onFocus={handleNotesFocus}
              placeholder="Every check-in counts. How are you feeling?"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Box alignItems="flex-end">
              <AppText variant="subcaption" tone="primary">
                {remainingChars} characters remaining
              </AppText>
            </Box>
          </Box>
        </AppCard>
      </View>
    );
  },
);
