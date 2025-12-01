import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/shared/error';
import {
  updateTrackingRecord,
  type UpdateTrackingRecordPayload,
} from '../api/updateTrackingRecord';
import {
  createTrackingRecord,
  type CreateTrackingRecordPayload,
} from '../api/createTrackingRecord';
import { deleteTrackingRecord } from '../api/deleteTrackingRecord';
import {
  CravingAnalyticsResponse,
  SmokingAnalyticsResponse,
  TrackingType,
} from '../types';
import { useCurrentUserId } from './useCurrentUserId';
import { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';

interface UpdateTrackingRecordMutationPayload {
  record_id: number;
  data: UpdateTrackingRecordPayload;
  oldRecord?: TrackingRecordApiResponse; // Optional for optimistic updates
}

interface DeleteTrackingRecordMutationPayload {
  recordId: number;
  record?: TrackingRecordApiResponse; // Optional for optimistic updates
}

export const useTrackingMutations = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();

  const getTrackingTypeCategory = (
    typeId: number,
  ): 'CRAVING' | 'SMOKE' | undefined => {
    const types = queryClient.getQueryData<TrackingType[]>(['trackingTypes']);
    const type = types?.find(t => t.id === typeId);
    if (!type) return undefined;

    // Check code first, then fallback to display name logic used in UI components
    if (type.code === 'CRAVING') return 'CRAVING';
    if (type.code === 'SMOKE') return 'SMOKE';

    const lowerName = type.displayName.toLowerCase();
    if (lowerName.includes('craving')) return 'CRAVING';
    if (lowerName.includes('smoke') || lowerName.includes('cigarette'))
      return 'SMOKE';

    return undefined;
  };

  const getDateKey = (dateStr: string) => {
    return dateStr.split('T')[0];
  };

  const updateCravingAnalytics = (
    updater: (old: CravingAnalyticsResponse) => CravingAnalyticsResponse,
  ) => {
    queryClient.setQueryData<CravingAnalyticsResponse>(
      ['cravingAnalytics', userId],
      old => (old ? updater(old) : old),
    );
  };

  const updateSmokingAnalytics = (
    updater: (old: SmokingAnalyticsResponse) => SmokingAnalyticsResponse,
  ) => {
    queryClient.setQueryData<SmokingAnalyticsResponse>(
      ['smokingAnalytics', userId],
      old => (old ? updater(old) : old),
    );
  };

  const createMutation = useMutation({
    mutationFn: createTrackingRecord,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteTrackingRecords'] });

      const category = getTrackingTypeCategory(variables.tracking_type_id);
      const dateKey = getDateKey(variables.event_at);

      if (category === 'CRAVING') {
        updateCravingAnalytics(old => ({
          ...old,
          total_cravings: old.total_cravings + 1,
          cravings_by_day: {
            ...old.cravings_by_day,
            [dateKey]: (old.cravings_by_day[dateKey] || 0) + 1,
          },
        }));
        updateSmokingAnalytics(old => ({
          ...old,
          skipped_smokes: old.skipped_smokes + 1,
        }));
      } else if (category === 'SMOKE') {
        updateSmokingAnalytics(old => ({
          ...old,
          total_smokes: old.total_smokes + 1,
        }));
      }
    },
    onError: error => {
      handleError(error, {
        context: { operation: 'create_tracking_record' },
        showToast: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ recordId }: DeleteTrackingRecordMutationPayload) =>
      deleteTrackingRecord(recordId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteTrackingRecords'] });

      if (variables.record) {
        const { tracking_type_id, event_at } = variables.record;
        const category = getTrackingTypeCategory(tracking_type_id);
        const dateKey = getDateKey(event_at);

        if (category === 'CRAVING') {
          updateCravingAnalytics(old => ({
            ...old,
            total_cravings: Math.max(0, old.total_cravings - 1),
            cravings_by_day: {
              ...old.cravings_by_day,
              [dateKey]: Math.max(0, (old.cravings_by_day[dateKey] || 0) - 1),
            },
          }));
          updateSmokingAnalytics(old => ({
            ...old,
            skipped_smokes: Math.max(0, old.skipped_smokes - 1),
          }));
        } else if (category === 'SMOKE') {
          updateSmokingAnalytics(old => ({
            ...old,
            total_smokes: Math.max(0, old.total_smokes - 1),
          }));
        }
      }
    },
    onError: (error, variables) => {
      handleError(error, {
        context: {
          operation: 'delete_tracking_record',
          recordId: variables.recordId,
        },
        showToast: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ record_id, data }: UpdateTrackingRecordMutationPayload) =>
      updateTrackingRecord(record_id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({
        queryKey: ['trackingRecords', variables.record_id],
      });
      queryClient.invalidateQueries({ queryKey: ['infiniteTrackingRecords'] });

      if (variables.oldRecord) {
        const oldRecord = variables.oldRecord;
        const newDate = variables.data.event_at || oldRecord.event_at;
        const newTypeId =
          variables.data.tracking_type_id || oldRecord.tracking_type_id;

        const oldCategory = getTrackingTypeCategory(oldRecord.tracking_type_id);
        const newCategory = getTrackingTypeCategory(newTypeId);

        const oldDateKey = getDateKey(oldRecord.event_at);
        const newDateKey = getDateKey(newDate);

        // Handle Craving -> Craving (Date change)
        if (oldCategory === 'CRAVING' && newCategory === 'CRAVING') {
          if (oldDateKey !== newDateKey) {
            updateCravingAnalytics(old => {
              const oldDayCount = Math.max(
                0,
                (old.cravings_by_day[oldDateKey] || 0) - 1,
              );
              const newDayCount = (old.cravings_by_day[newDateKey] || 0) + 1;
              return {
                ...old,
                cravings_by_day: {
                  ...old.cravings_by_day,
                  [oldDateKey]: oldDayCount,
                  [newDateKey]: newDayCount,
                },
              };
            });
          }
        }
        // Handle Craving -> Smoke
        else if (oldCategory === 'CRAVING' && newCategory === 'SMOKE') {
          updateCravingAnalytics(old => ({
            ...old,
            total_cravings: Math.max(0, old.total_cravings - 1),
            cravings_by_day: {
              ...old.cravings_by_day,
              [oldDateKey]: Math.max(
                0,
                (old.cravings_by_day[oldDateKey] || 0) - 1,
              ),
            },
          }));
          updateSmokingAnalytics(old => ({
            ...old,
            total_smokes: old.total_smokes + 1,
            skipped_smokes: Math.max(0, old.skipped_smokes - 1),
          }));
        }
        // Handle Smoke -> Craving
        else if (oldCategory === 'SMOKE' && newCategory === 'CRAVING') {
          updateSmokingAnalytics(old => ({
            ...old,
            total_smokes: Math.max(0, old.total_smokes - 1),
            skipped_smokes: old.skipped_smokes + 1,
          }));
          updateCravingAnalytics(old => ({
            ...old,
            total_cravings: old.total_cravings + 1,
            cravings_by_day: {
              ...old.cravings_by_day,
              [newDateKey]: (old.cravings_by_day[newDateKey] || 0) + 1,
            },
          }));
        }
        // Handle Smoke -> Smoke (Date change - doesn't affect total_smokes, but might affect other stats if we tracked them)
        // For now, total_smokes is just a count.
      }
    },
    onError: (error, variables) => {
      handleError(error, {
        context: {
          operation: 'update_tracking_record',
          record_id: variables.record_id,
        },
        showToast: true,
      });
    },
  });

  return {
    update: updateMutation,
    create: createMutation,
    delete: deleteMutation,
    isLoading:
      updateMutation.isPending ||
      createMutation.isPending ||
      deleteMutation.isPending,
    error: updateMutation.error || createMutation.error || deleteMutation.error,
  };
};
