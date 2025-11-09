import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';

export const submitQuestionAnswer = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  const response = await fetch(QUESTIONNAIRE_ANSWER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to submit questionnaire answer');
  }
};
