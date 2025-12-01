import { authenticatedPost } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { QUESTIONNAIRE_COMPLETE_ENDPOINT } from './endpoints';
import type { QuestionnaireCompleteResponse } from '../types';

const OPERATION = 'complete_questionnaire';

export async function completeQuestionnaire(): Promise<QuestionnaireCompleteResponse> {
  try {
    const response = await authenticatedPost(QUESTIONNAIRE_COMPLETE_ENDPOINT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw ErrorFactory.apiError(
        response.status,
        errorData.message || 'Failed to complete questionnaire',
        {
          url: QUESTIONNAIRE_COMPLETE_ENDPOINT,
          operation: OPERATION,
          errorData,
        },
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    throw ErrorFactory.networkError(
      `Failed to complete questionnaire: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        url: QUESTIONNAIRE_COMPLETE_ENDPOINT,
        operation: OPERATION,
        originalError: error,
      },
    );
  }
}
