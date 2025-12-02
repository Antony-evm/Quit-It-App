import { publicGet, API_BASE_URL } from '@/shared/api/apiConfig';
import { UserTypesResponse } from '@/shared/types/userType';

/**
 * Fetch all available user types from the backend
 */
export const fetchUserTypes = async (): Promise<UserTypesResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/types`;
  const response = await publicGet(url);

  if (!response.ok) {
    throw new Error('Failed to fetch user types');
  }

  return response.json();
};
