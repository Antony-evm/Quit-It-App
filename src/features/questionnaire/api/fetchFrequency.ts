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
export const fetchFrequency = async (): Promise<FrequencyApiData> => {
  const response = await authenticatedGet(QUESTIONNAIRE_FREQUENCY_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch frequency data: ${response.status}`);
  }

  const responseData: FetchFrequencyResponse = await response.json();
  return responseData.data;
};
