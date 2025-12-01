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
  recordId,
  initialValues,
  onSaveSuccess,
  onDeleteSuccess,
  scrollViewRef,
}: UseNotesCardControllerOptions = {}) => {
  const queryClient = useQueryClient();

  const { data: trackingTypes } = useTrackingTypes();
  const { showToast } = useToast();
  const { addRecordToCache, updateRecordInCache, removeRecordFromCache } =
    useInfiniteTrackingRecords();
  const { create, update, delete: deleteMutation } = useTrackingMutations();

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

  const selectedTrackingType = sortedTrackingTypes?.find(
    type => type.id === selectedTrackingTypeId,
  );

  const accentColor = useMemo(() => {
    return getTrackingTypeColors(selectedTrackingType?.code).accent;
  }, [selectedTrackingType?.code]);

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
      queryKey: ['cravingAnalytics'],
    });
    queryClient.invalidateQueries({
      queryKey: ['smokingAnalytics'],
    });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    setNotes('');
    setSelectedDateTime(new Date());
  }, []);

  const buildPayload = useCallback(() => {
    if (!selectedTrackingType) return null;
    return {
      tracking_type_id: selectedTrackingType.id,
      event_at: selectedDateTime.toISOString(),
      note: notes.trim() || null,
    };
  }, [selectedTrackingType, selectedDateTime, notes]);

  const buildOldRecord = useCallback(():
    | TrackingRecordApiResponse
    | undefined => {
    if (!recordId || !initialValues) return undefined;
    return {
      record_id: recordId,
      tracking_type_id: initialValues.trackingTypeId,
      event_at: initialValues.dateTime.toISOString(),
      note: initialValues.notes || null,
    };
  }, [recordId, initialValues]);

  const buildUpdatedRecord =
    useCallback((): TrackingRecordApiResponse | null => {
      if (!recordId || !selectedTrackingType) return null;
      return {
        record_id: recordId,
        tracking_type_id: selectedTrackingType.id,
        event_at: selectedDateTime.toISOString(),
        note: notes.trim() || null,
      };
    }, [recordId, selectedTrackingType, selectedDateTime, notes]);

  const createSuccessCallbacks = useCallback(
    (options: {
      successMessage: string;
      errorMessage: string;
      onSuccess?: () => void;
      onRollback?: () => void;
    }) => ({
      onSuccess: () => {
        options.onSuccess?.();
        showToast(options.successMessage, 'success');
        invalidateAnalyticsQueries();
      },
      onError: (error: Error) => {
        options.onRollback?.();
        showToast(
          error instanceof Error ? error.message : options.errorMessage,
          'error',
        );
      },
    }),
    [showToast, invalidateAnalyticsQueries],
  );

  const hasFormChanged = useCallback(() => {
    if (!initialValues) return true;
    return (
      selectedTrackingTypeId !== initialValues.trackingTypeId ||
      selectedDateTime.getTime() !== initialValues.dateTime.getTime() ||
      notes !== initialValues.notes
    );
  }, [initialValues, selectedTrackingTypeId, selectedDateTime, notes]);

  const handleCreate = useCallback(() => {
    const payload = buildPayload();
    if (!payload) return;

    create.mutate(payload, {
      onSuccess: newRecord => {
        // Add the real record from server response to cache
        addRecordToCache(newRecord);
        resetForm();
        onSaveSuccess?.();
        showToast('Your tracking entry has been saved!', 'success');
        invalidateAnalyticsQueries();
      },
      onError: (error: Error) => {
        showToast(
          error instanceof Error
            ? error.message
            : 'Failed to save tracking entry',
          'error',
        );
      },
    });
  }, [
    buildPayload,
    addRecordToCache,
    create,
    resetForm,
    onSaveSuccess,
    showToast,
    invalidateAnalyticsQueries,
  ]);

  const handleUpdate = useCallback(() => {
    if (!recordId) return;

    const updatedRecord = buildUpdatedRecord();
    if (!updatedRecord) return;

    const oldRecord = buildOldRecord();

    // Optimistic update
    updateRecordInCache(updatedRecord);

    update.mutate(
      {
        record_id: recordId,
        data: {
          tracking_type_id: updatedRecord.tracking_type_id,
          event_at: updatedRecord.event_at,
          note: updatedRecord.note || undefined,
        },
        oldRecord,
      },
      createSuccessCallbacks({
        successMessage: 'Your tracking entry has been updated!',
        errorMessage: 'Failed to update tracking entry',
        onSuccess: () => onSaveSuccess?.(),
        onRollback: () => {
          if (oldRecord) updateRecordInCache(oldRecord);
        },
      }),
    );
  }, [
    recordId,
    buildUpdatedRecord,
    buildOldRecord,
    updateRecordInCache,
    update,
    createSuccessCallbacks,
    onSaveSuccess,
  ]);

  const handleSave = useCallback(() => {
    if (!selectedTrackingType) return;
    if (!hasFormChanged()) {
      onSaveSuccess?.();
      return;
    }

    if (recordId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  }, [
    selectedTrackingType,
    hasFormChanged,
    onSaveSuccess,
    recordId,
    handleUpdate,
    handleCreate,
  ]);

  const handleDelete = useCallback(() => {
    if (!recordId) return;

    const recordToDelete: TrackingRecordApiResponse | undefined = initialValues
      ? {
          record_id: recordId,
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
