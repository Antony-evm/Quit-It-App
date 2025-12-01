import { publicGet, API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { LoginUserPayload, LoginUserResponse } from './types';

/**
 * Login/sync user with the backend after successful Stytch authentication
 */
export const loginUser = async (
  payload: LoginUserPayload,
): Promise<LoginUserResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth?user_id=${encodeURIComponent(
    payload.stytch_user_id,
  )}`;

  try {
    const response = await publicGet(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Failed to login user';

      throw ErrorFactory.apiError(response.status, errorMessage, {
        payload,
        url,
        operation: 'login_user',
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
      `Failed to login user: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        payload,
        url,
        operation: 'login_user',
        originalError: error,
      },
    );
  }
};
