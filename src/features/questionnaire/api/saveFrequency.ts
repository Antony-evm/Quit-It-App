import { apiPost } from '@/shared/api/apiConfig';
import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';

/**
 * Save the user's frequency data by submitting the questionnaire answer
 */
export const saveFrequency = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  const response = await apiPost(QUESTIONNAIRE_ANSWER_ENDPOINT, payload);

  if (!response.ok) {
    throw new Error(`Failed to save frequency: ${response.status}`);
  }
};
