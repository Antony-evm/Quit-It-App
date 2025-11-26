import { authenticatedGet } from '@/shared/api/apiConfig';
import { QUESTIONNAIRE_TRIGGERS_ENDPOINT } from './endpoints';

export interface FetchTriggersResponse {
  data: string[];
}

/**
 * Fetch the user's triggers from the questionnaire endpoint
 */
export const fetchTriggers = async (userId: number): Promise<string[]> => {
  if (!userId) {
    throw new Error('User ID not available');
  }

  const queryParams = new URLSearchParams({
    user_id: userId.toString(),
  });
  const url = `${QUESTIONNAIRE_TRIGGERS_ENDPOINT}?${queryParams}`;

  const response = await authenticatedGet(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch triggers: ${response.status}`);
  }

  const responseData: FetchTriggersResponse = await response.json();
  return responseData.data;
};
