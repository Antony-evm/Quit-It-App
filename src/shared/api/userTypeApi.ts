import { publicGet, API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { UserTypesResponse } from '@/shared/types/userType';

/**
 * Fetch all available user types from the backend
 */
export const fetchUserTypes = async (): Promise<UserTypesResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/types`;

  try {
    const response = await publicGet(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Failed to fetch user types';

      throw ErrorFactory.apiError(response.status, errorMessage, {
        url,
        operation: 'fetch_user_types',
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
      `Failed to fetch user types: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        url,
        operation: 'fetch_user_types',
        originalError: error,
      },
    );
  }
};
