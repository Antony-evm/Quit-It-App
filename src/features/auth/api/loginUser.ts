import { authenticatedGet, API_BASE_URL } from '@/shared/api/apiConfig';
import { LoginUserPayload, LoginUserResponse } from './types';

/**
 * Login/sync user with the backend after successful Stytch authentication
 */
export const loginUser = async (
  payload: LoginUserPayload,
): Promise<LoginUserResponse> => {
  // Use the stytch_user_id as the user_id query parameter
  const response = await authenticatedGet(
    `${API_BASE_URL}/api/v1/auth?user_id=${encodeURIComponent(
      payload.stytch_user_id,
    )}`,
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to login user: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();
  return result;
};
