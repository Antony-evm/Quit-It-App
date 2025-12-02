import { apiGet } from '@/shared/api/apiConfig';
import { QUESTIONNAIRE_FREQUENCY_ENDPOINT } from './endpoints';

export type FrequencyData = Record<string, string>;

interface FetchFrequencyResponse {
  data: FrequencyData;
}

export async function fetchFrequency(): Promise<FrequencyData> {
  const response = await apiGet(QUESTIONNAIRE_FREQUENCY_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch frequency data');
  }

  const responseData: FetchFrequencyResponse = await response.json();
  return responseData.data;
}
