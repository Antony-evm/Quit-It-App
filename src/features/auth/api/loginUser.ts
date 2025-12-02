import { publicGet, API_BASE_URL } from '@/shared/api/apiConfig';
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
  const response = await publicGet(url);

  if (!response.ok) {
    throw new Error('Failed to login user');
  }

  return response.json();
};
