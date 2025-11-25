import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/shared/error';
import {
  updateTrackingRecord,
  type UpdateTrackingRecordPayload,
} from '../api/updateTrackingRecord';

interface UpdateTrackingRecordMutationPayload {
  record_id: number;
  data: UpdateTrackingRecordPayload;
}

export const useUpdateTrackingRecordMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ record_id, data }: UpdateTrackingRecordMutationPayload) =>
      updateTrackingRecord(record_id, data),
    onSuccess: (_, variables) => {
      // Invalidate tracking-related queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({
        queryKey: ['trackingRecords', variables.record_id],
      });

      // Also invalidate infinite queries if they exist
      queryClient.invalidateQueries({
        queryKey: ['infiniteTrackingRecords'],
      });
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
};

// Hook for creating new tracking records (if the API supports it)
export const useCreateTrackingRecordMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTrackingRecordPayload) => {
      // This would need to be implemented if there's a create endpoint
      throw new Error('Create tracking record API not implemented yet');
    },
    onSuccess: () => {
      // Invalidate tracking-related queries
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({
        queryKey: ['infiniteTrackingRecords'],
      });
      queryClient.invalidateQueries({ queryKey: ['trackingTypes'] });
    },
    onError: error => {
      handleError(error, {
        context: { operation: 'create_tracking_record' },
        showToast: true,
      });
    },
  });
};

// Combined tracking mutations hook
export const useTrackingMutations = () => {
  const updateMutation = useUpdateTrackingRecordMutation();
  const createMutation = useCreateTrackingRecordMutation();

  return {
    update: updateMutation,
    create: createMutation,
    isLoading: updateMutation.isPending || createMutation.isPending,
    error: updateMutation.error || createMutation.error,
  };
};
