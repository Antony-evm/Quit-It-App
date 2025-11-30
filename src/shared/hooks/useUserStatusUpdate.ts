import { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';
import type { UserDataResponse } from '@/shared/types/api';
import { RootStackParamList } from '@/types/navigation';

/**
 * Custom hook for handling user status updates when new data arrives from backend
 * This ensures user data and status cache are properly synchronized
 */
export const useUserStatusUpdate = () => {
  const { updateUserData } = useAuth();

  /**
   * Handle user status update from API response
   * Updates both AuthContext user data and UserStatusService cache
   */
  const handleUserStatusUpdate = useCallback(
    async (response: UserDataResponse): Promise<void> => {
      const responseData = response.data;

      // Step 1: Update complete user data in AuthContext including firstName/lastName
      await updateUserData(responseData);

      // Step 2: Force refresh UserStatusService cache to ensure latest status mappings
      await UserStatusService.initialize({ forceRefresh: true });
    },
    [updateUserData],
  );

  /**
   * Handle user status update and navigation
   * Updates status data and executes appropriate navigation action
   */
  const handleUserStatusUpdateWithNavigation = useCallback(
    async (
      response: UserDataResponse,
      navigation: NativeStackNavigationProp<RootStackParamList, any>,
    ): Promise<void> => {
      try {
        const { user_status_id } = response.data;

        // Update user status and refresh cache
        await handleUserStatusUpdate(response);

        // Execute navigation based on the new user status
        UserStatusService.executeStatusAction(user_status_id, navigation);
      } catch (error) {
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
