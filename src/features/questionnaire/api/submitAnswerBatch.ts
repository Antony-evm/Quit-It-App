import type { QuestionnaireBatchAnswerPayload } from '../types';
import { QUESTIONNAIRE_BATCH_ANSWER_ENDPOINT } from './endpoints';
import { debugLogger } from '../../../shared/logging/debugLogger';

export const submitQuestionnaireAnswerBatch = async (
  payload: QuestionnaireBatchAnswerPayload,
): Promise<void> => {
  debugLogger.info('questionnaire/api', 'Submitting questionnaire batch payload', {
    totalAnswers: payload.answers.length,
  });

  try {
    const response = await fetch(QUESTIONNAIRE_BATCH_ANSWER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    debugLogger.info(
      'questionnaire/api',
      'Batch submission response received',
      {
        status: response.status,
      },
    );
  } catch (error) {
    debugLogger.warn(
      'questionnaire/api',
      'Batch submission request failed (ignored for now)',
      {
        message: (error as Error).message,
      },
    );
  }
};
