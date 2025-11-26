import { useCallback } from 'react';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';
import type { UserDataResponse } from '@/shared/types/api';

/**
 * Custom hook for handling user status updates when new data arrives from backend
 * This ensures user data and status cache are properly synchronized
 */
export const useUserStatusUpdate = () => {
  const { updateUserStatus } = useAuth();

  /**
   * Handle user status update from API response
   * Updates both AuthContext user data and UserStatusService cache
   */
  const handleUserStatusUpdate = useCallback(
    async (response: UserDataResponse): Promise<void> => {
      try {
        const { user_status_id } = response.data;

        console.log('[UserStatusUpdate] Processing status update:', user_status_id);

        // Step 1: Update user status in AuthContext to keep user data fresh
        await updateUserStatus(user_status_id);

        // Step 2: Force refresh UserStatusService cache to ensure latest status mappings
        await UserStatusService.initialize({ forceRefresh: true });

        console.log('[UserStatusUpdate] User status update completed successfully');
      } catch (error) {
        console.error('[UserStatusUpdate] Failed to update user status:', error);
        throw error;
      }
    },
    [updateUserStatus],
  );

  /**
   * Handle user status update and navigation
   * Updates status data and executes appropriate navigation action
   */
  const handleUserStatusUpdateWithNavigation = useCallback(
    async (
      response: UserDataResponse,
      navigation: any, // Navigation prop
    ): Promise<void> => {
      try {
        const { user_status_id } = response.data;

        // Update user status and refresh cache
        await handleUserStatusUpdate(response);

        // Execute navigation based on the new user status
        UserStatusService.executeStatusAction(user_status_id, navigation);
      } catch (error) {
        console.error(
          '[UserStatusUpdate] Failed to update status and navigate:',
          error,
        );
        throw error;
      }
    },
    [handleUserStatusUpdate],
  );

  return {
    handleUserStatusUpdate,
    handleUserStatusUpdateWithNavigation,
  };
};