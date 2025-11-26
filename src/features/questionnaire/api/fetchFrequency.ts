import { authenticatedGet } from '@/shared/api/apiConfig';
import { QUESTIONNAIRE_FREQUENCY_ENDPOINT } from './endpoints';

export interface FrequencyApiData {
  [key: string]: any;
}

export interface FetchFrequencyResponse {
  data: FrequencyApiData;
}

/**
 * Fetch the user's frequency data from the questionnaire endpoint
 */
export const fetchFrequency = async (
  userId: number,
): Promise<FrequencyApiData> => {
  if (!userId) {
    throw new Error('User ID not available');
  }

  const queryParams = new URLSearchParams({
    user_id: userId.toString(),
  });
  const url = `${QUESTIONNAIRE_FREQUENCY_ENDPOINT}?${queryParams}`;

  const response = await authenticatedGet(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch frequency data: ${response.status}`);
  }

  const responseData: FetchFrequencyResponse = await response.json();
  return responseData.data;
};
