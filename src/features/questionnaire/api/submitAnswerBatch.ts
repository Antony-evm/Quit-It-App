import type { QuestionnaireBatchAnswerPayload } from '../types';
import { QUESTIONNAIRE_BATCH_ANSWER_ENDPOINT } from './endpoints';

export const submitQuestionnaireAnswerBatch = async (
  payload: QuestionnaireBatchAnswerPayload,
): Promise<void> => {
  try {
    await fetch(QUESTIONNAIRE_BATCH_ANSWER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Ignore failures for now to avoid blocking questionnaire progression.
  }
};
