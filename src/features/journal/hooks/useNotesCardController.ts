import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  useTrackingTypes,
  useInfiniteTrackingRecords,
} from '@/features/tracking';
import { useTrackingMutations } from '@/features/tracking/hooks/useTrackingMutations';
import type { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import { useToast } from '@/shared/components/toast';
import { getTrackingTypeColors } from '@/features/tracking/constants';
import ScrollManager from '@/utils/scrollManager';
import type {
  UseNotesCardControllerOptions,
  TrackingTypeOption,
} from '../types';

const MAX_CHARS = 500;

export const useNotesCardController = ({
  userId,
  recordId,
  initialValues,
  onSaveSuccess,
  onDeleteSuccess,
  scrollViewRef,
}: UseNotesCardControllerOptions = {}) => {
  const queryClient = useQueryClient();

  if (userId === undefined) {
    throw new Error('useNotesCardController: userId is required');
  }

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
  } = useTrackingMutations(userId);

  // Form state
  const [selectedTrackingTypeId, setSelectedTrackingTypeId] = useState<
    number | null
  >(initialValues?.trackingTypeId ?? null);
  const [selectedDateTime, setSelectedDateTime] = useState(
    initialValues?.dateTime ?? new Date(),
  );
  const [notes, setNotes] = useState(initialValues?.notes ?? '');

  const cardRef = useRef<View>(null);

  // Sync with initial values when they change (e.g., when editing different records)
  // Use individual values to avoid unnecessary re-renders from object reference changes
  const initialTrackingTypeId = initialValues?.trackingTypeId;
  const initialDateTime = initialValues?.dateTime?.getTime();
  const initialNotes = initialValues?.notes;

  useEffect(() => {
    if (initialTrackingTypeId !== undefined) {
      setSelectedTrackingTypeId(initialTrackingTypeId);
    }
    if (initialDateTime !== undefined) {
      setSelectedDateTime(new Date(initialDateTime));
    }
    if (initialNotes !== undefined) {
      setNotes(initialNotes);
    }
  }, [initialTrackingTypeId, initialDateTime, initialNotes]);

  // Cleanup scroll manager on unmount
  useEffect(() => {
    return () => {
      ScrollManager.cancelCurrent();
    };
  }, []);

  // Sort tracking types alphabetically
  const sortedTrackingTypes: TrackingTypeOption[] = useMemo(() => {
    if (!trackingTypes) return [];
    return [...trackingTypes].sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );
  }, [trackingTypes]);

  // Auto-select default tracking type
  useEffect(() => {
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

  // Get selected tracking type details
  const selectedTrackingType = sortedTrackingTypes?.find(
    type => type.id === selectedTrackingTypeId,
  );

  // Determine accent color based on tracking type
  const accentColor = useMemo(() => {
    return getTrackingTypeColors(selectedTrackingType?.code).accent;
  }, [selectedTrackingType?.code]);

  // Handlers
  const handleDateTimeChange = useCallback(
    (newDateTime: Date) => {
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
    },
    [showToast],
  );

  const handleNotesChange = useCallback((text: string) => {
    if (text.length <= MAX_CHARS) {
      setNotes(text);
    }
  }, []);

  const handleNotesFocus = useCallback(() => {
    ScrollManager.scheduleScroll(() => {
      ScrollManager.scrollCardToPosition(cardRef, scrollViewRef, 0.2);
    }, 50);
  }, [scrollViewRef]);

  const handleTrackingTypeSelect = useCallback((trackingTypeId: number) => {
    setSelectedTrackingTypeId(trackingTypeId);
  }, []);

  const invalidateAnalyticsQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['cravingAnalytics', userId],
    });
    queryClient.invalidateQueries({
      queryKey: ['smokingAnalytics', userId],
    });
  }, [queryClient, userId]);

  const resetForm = useCallback(() => {
    setNotes('');
    setSelectedDateTime(new Date());
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedTrackingType) return;

    // Check if values haven't changed (for edit mode)
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
      user_id: userId,
      tracking_type_id: selectedTrackingType.id,
      event_at: selectedDateTime.toISOString(),
      note: notes.trim() || null,
    };

    if (recordId) {
      const oldRecord: TrackingRecordApiResponse | undefined = initialValues
        ? {
            record_id: recordId,
            user_id: userId,
            tracking_type_id: initialValues.trackingTypeId,
            event_at: initialValues.dateTime.toISOString(),
            note: initialValues.notes || null,
          }
        : undefined;

      const updatedRecord: TrackingRecordApiResponse = {
        record_id: recordId,
        user_id: userId,
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
            invalidateAnalyticsQueries();
          },
          onError: error => {
            // Rollback optimistic update
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
      // Create new record
      const tempId = Date.now();
      const optimisticRecord: TrackingRecordApiResponse = {
        record_id: tempId,
        user_id: payload.user_id,
        tracking_type_id: payload.tracking_type_id,
        event_at: payload.event_at,
        note: payload.note || null,
      };

      // Optimistic update
      addRecordToCache(optimisticRecord);

      create.mutate(payload, {
        onSuccess: realRecord => {
          replaceOptimisticRecord(tempId, realRecord);
          resetForm();
          onSaveSuccess?.();
          showToast('Your tracking entry has been saved!', 'success');
          invalidateAnalyticsQueries();
        },
        onError: error => {
          // Rollback optimistic update
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
  }, [
    selectedTrackingType,
    selectedTrackingTypeId,
    selectedDateTime,
    notes,
    initialValues,
    recordId,
    userId,
    onSaveSuccess,
    updateRecordInCache,
    update,
    addRecordToCache,
    create,
    replaceOptimisticRecord,
    removeRecordFromCache,
    resetForm,
    showToast,
    invalidateAnalyticsQueries,
  ]);

  const handleDelete = useCallback(() => {
    if (!recordId) return;

    const recordToDelete: TrackingRecordApiResponse | undefined = initialValues
      ? {
          record_id: recordId,
          user_id: userId,
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
          invalidateAnalyticsQueries();
        },
        onError: error => {
          // Rollback optimistic update
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
  }, [
    recordId,
    initialValues,
    userId,
    removeRecordFromCache,
    deleteMutation,
    addRecordToCache,
    onDeleteSuccess,
    showToast,
    invalidateAnalyticsQueries,
  ]);

  const isLoading =
    create.isPending || update.isPending || deleteMutation.isPending;

  return {
    // Form state
    selectedTrackingTypeId,
    selectedDateTime,
    notes,
    maxChars: MAX_CHARS,

    // Derived data
    trackingTypes: sortedTrackingTypes,
    accentColor,
    isLoading,
    isReady: sortedTrackingTypes.length > 0,

    // Refs
    cardRef,

    // Handlers
    onTrackingTypeSelect: handleTrackingTypeSelect,
    onDateTimeChange: handleDateTimeChange,
    onNotesChange: handleNotesChange,
    onNotesFocus: handleNotesFocus,

    save: handleSave,
    delete: handleDelete,
  };
};
