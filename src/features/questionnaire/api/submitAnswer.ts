import { authenticatedPost } from '@/shared/api/apiConfig';
import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';

export const submitQuestionAnswer = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {

  const response = await authenticatedPost(
    QUESTIONNAIRE_ANSWER_ENDPOINT,
    payload,
  );

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => 'Unable to read error response');
    try {
      const errorData = JSON.parse(errorText);
      
    } catch {
      }

    throw new Error(
      `Failed to submit questionnaire answer (${response.status}): ${errorText}`,
    );
  }

  };
