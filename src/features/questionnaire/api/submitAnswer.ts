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
    throw new Error('Failed to submit questionnaire answer');
  }
};
