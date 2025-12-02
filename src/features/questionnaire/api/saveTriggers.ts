import { apiPost } from '@/shared/api/apiConfig';
import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';

/**
 * Save the user's triggers by submitting the questionnaire answer
 */
export const saveTriggers = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  const response = await apiPost(QUESTIONNAIRE_ANSWER_ENDPOINT, payload);

  if (!response.ok) {
    throw new Error(`Failed to save triggers: ${response.status}`);
  }
};
