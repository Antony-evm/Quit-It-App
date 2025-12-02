import { apiPost } from '@/shared/api/apiConfig';
import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';

/**
 * Submit a questionnaire answer to the backend
 */
export const submitQuestionAnswer = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  const response = await apiPost(QUESTIONNAIRE_ANSWER_ENDPOINT, payload);

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => 'Unable to read error response');
    throw new Error(
      `Failed to submit questionnaire answer (${response.status}): ${errorText}`,
    );
  }
};
