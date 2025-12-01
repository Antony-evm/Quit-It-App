import { publicPost, API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { CreateUserPayload, CreateUserResponse } from './types';

export const createUser = async (
  payload: CreateUserPayload,
): Promise<CreateUserResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/create`;

  try {
    const response = await publicPost(url, payload);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Failed to create user';

      throw ErrorFactory.apiError(response.status, errorMessage, {
        payload,
        url,
        operation: 'create_user',
        errorData,
      });
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    throw ErrorFactory.networkError(
      `Failed to create user: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        payload,
        url,
        operation: 'create_user',
        originalError: error,
      },
    );
  }
};
