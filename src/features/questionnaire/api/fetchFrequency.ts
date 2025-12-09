import { apiGet } from '@/shared/api/apiConfig';
import { QUESTIONNAIRE_FREQUENCY_ENDPOINT } from './endpoints';

export interface FrequencyItem {
  time_period: string;
  frequency: string;
}

export interface FrequencyDataResponse {
  frequency_data: FrequencyItem[];
}

interface FetchFrequencyResponse {
  data: FrequencyDataResponse;
}

export type FrequencyData = Record<string, string>;

export async function fetchFrequency(): Promise<FrequencyData> {
  const response = await apiGet(QUESTIONNAIRE_FREQUENCY_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to fetch frequency data');
  }

  const responseData: FetchFrequencyResponse = await response.json();

  // Convert array format to Record format for backward compatibility
  const frequencyRecord: FrequencyData = {};
  responseData.data.frequency_data.forEach(item => {
    frequencyRecord[item.time_period] = item.frequency;
  });

  return frequencyRecord;
}
