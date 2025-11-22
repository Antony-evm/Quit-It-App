import { authenticatedPost, API_BASE_URL } from '@/shared/api/apiConfig';
import { CreateUserPayload, CreateUserResponse } from './types';

/**
 * Register a new user with the backend after successful Stytch authentication
 */
export const createUser = async (
  payload: CreateUserPayload,
): Promise<CreateUserResponse> => {
  const response = await authenticatedPost(
    `${API_BASE_URL}/api/v1/auth/create`,
    payload,
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to create user: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();
  return result;
};
