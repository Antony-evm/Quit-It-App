import { authenticatedPost } from '@/shared/api/apiConfig';
import type { QuestionnaireAnswerPayload } from '../types';
import { QUESTIONNAIRE_ANSWER_ENDPOINT } from './endpoints';

export const submitQuestionAnswer = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  console.log(
    '[submitQuestionAnswer] Sending payload:',
    JSON.stringify(payload, null, 2),
  );

  const response = await authenticatedPost(
    QUESTIONNAIRE_ANSWER_ENDPOINT,
    payload,
  );

  console.log('[submitQuestionAnswer] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => 'Unable to read error response');
    console.error('[submitQuestionAnswer] Error response body:', errorText);

    try {
      const errorData = JSON.parse(errorText);
      console.error(
        '[submitQuestionAnswer] Parsed error data:',
        JSON.stringify(errorData, null, 2),
      );
    } catch {
      console.error('[submitQuestionAnswer] Could not parse error as JSON');
    }

    throw new Error(
      `Failed to submit questionnaire answer (${response.status}): ${errorText}`,
    );
  }

  console.log('[submitQuestionAnswer] Answer submitted successfully');
};
