import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';
import { debugLogger } from '../../../shared/logging/debugLogger';

export const submitQuestionAnswer = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  debugLogger.info('questionnaire/api', 'Submitting questionnaire answer', {
    questionId: payload.question_id,
    answerCount: payload.answer_options.length,
  });

  const response = await fetch(QUESTIONNAIRE_ANSWER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  debugLogger.info('questionnaire/api', 'Received answer submission response', {
    questionId: payload.question_id,
    status: response.status,
  });

  if (!response.ok) {
    debugLogger.error('questionnaire/api', 'Failed to submit questionnaire answer', {
      questionId: payload.question_id,
      status: response.status,
    });
    throw new Error('Failed to submit questionnaire answer');
  }
};
