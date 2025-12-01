import { authenticatedGet } from '@/shared/api/apiConfig';
import type { FetchTriggersResponse } from '../types';
import { QUESTIONNAIRE_TRIGGERS_ENDPOINT } from './endpoints';

/**
 * Fetch the user's triggers from the questionnaire endpoint
 */
export const fetchTriggers = async (): Promise<string[]> => {
  const response = await authenticatedGet(QUESTIONNAIRE_TRIGGERS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch triggers: ${response.status}`);
  }

  const responseData: FetchTriggersResponse = await response.json();
  return responseData.data;
};
