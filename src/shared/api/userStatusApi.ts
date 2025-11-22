import { publicGet, API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { UserStatusesResponse } from '@/shared/types/userStatus';

/**
 * Fetch all available user statuses from the backend
 */
export const fetchUserStatuses = async (): Promise<UserStatusesResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/statuses`;

  try {
    const response = await publicGet(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Failed to fetch user statuses';

      throw ErrorFactory.apiError(response.status, errorMessage, {
        url,
        operation: 'fetch_user_statuses',
        errorData,
      });
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw ErrorFactory.networkError(
      `Failed to fetch user statuses: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        url,
        operation: 'fetch_user_statuses',
        originalError: error,
      },
    );
  }
};
