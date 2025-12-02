import { publicGet, API_BASE_URL } from '@/shared/api/apiConfig';
import { UserStatusesResponse } from '@/shared/types/userStatus';

/**
 * Fetch all available user statuses from the backend
 */
export const fetchUserStatuses = async (): Promise<UserStatusesResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/statuses`;
  const response = await publicGet(url);

  if (!response.ok) {
    throw new Error('Failed to fetch user statuses');
  }

  return response.json();
};
