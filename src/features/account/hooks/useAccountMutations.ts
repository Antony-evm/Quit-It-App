import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/shared/error';

// Import the account API functions and types
import { updateQuitDate } from '../api/updateQuitDate';
import { updateSmokingTarget } from '../api/updateSmokingTarget';
import { updateNotificationSchedule } from '../api/updateNotificationSchedule';
import type {
  UpdateQuitDatePayload,
  UpdateSmokingTargetPayload,
  UpdateNotificationSchedulePayload,
} from '../types';

export const useUpdateQuitDateMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuitDatePayload) => updateQuitDate(payload),
    onSuccess: () => {
      // Invalidate account-related queries
      queryClient.invalidateQueries({ queryKey: ['quitDate'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['userGreeting'] });
    },
    onError: error => {
      handleError(error, {
        context: { operation: 'update_quit_date' },
        showToast: true,
      });
    },
  });
};

export const useUpdateSmokingTargetMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSmokingTargetPayload) =>
      updateSmokingTarget(payload),
    onSuccess: () => {
      // Invalidate account-related queries
      queryClient.invalidateQueries({ queryKey: ['smokingTarget'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
    onError: error => {
      handleError(error, {
        context: { operation: 'update_smoking_target' },
        showToast: true,
      });
    },
  });
};

export const useUpdateNotificationScheduleMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNotificationSchedulePayload) =>
      updateNotificationSchedule(payload),
    onSuccess: () => {
      // Invalidate account-related queries
      queryClient.invalidateQueries({ queryKey: ['notificationSchedule'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
    onError: error => {
      handleError(error, {
        context: { operation: 'update_notification_schedule' },
        showToast: true,
      });
    },
  });
};

// Combined account mutations hook
export const useAccountMutations = () => {
  const updateQuitDate = useUpdateQuitDateMutation();
  const updateSmokingTarget = useUpdateSmokingTargetMutation();
  const updateNotificationSchedule = useUpdateNotificationScheduleMutation();

  return {
    updateQuitDate,
    updateSmokingTarget,
    updateNotificationSchedule,
    isLoading:
      updateQuitDate.isPending ||
      updateSmokingTarget.isPending ||
      updateNotificationSchedule.isPending,
    error:
      updateQuitDate.error ||
      updateSmokingTarget.error ||
      updateNotificationSchedule.error,
  };
};
