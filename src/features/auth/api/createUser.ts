import { publicPost, API_BASE_URL } from '@/shared/api/apiConfig';
import { CreateUserPayload, CreateUserResponse } from './types';

export const createUser = async (
  payload: CreateUserPayload,
): Promise<CreateUserResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/create`;
  const response = await publicPost(url, payload);

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};
