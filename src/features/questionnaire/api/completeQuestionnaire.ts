import { authenticatedPost } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { QUESTIONNAIRE_COMPLETE_ENDPOINT } from './endpoints';
import type { QuestionnaireCompleteResponse } from '../types';

/**
 * Complete the questionnaire and get user status information
 */
export const completeQuestionnaire = async (
  userId: number,
): Promise<QuestionnaireCompleteResponse> => {
  if (!userId) {
    throw new Error('User ID not available');
  }

  const queryParams = new URLSearchParams({
    user_id: userId.toString(),
  });
  const url = `${QUESTIONNAIRE_COMPLETE_ENDPOINT}?${queryParams}`;

  try {
    const response = await authenticatedPost(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || 'Failed to complete questionnaire';

      throw ErrorFactory.apiError(response.status, errorMessage, {
        url: url,
        operation: 'complete_questionnaire',
        errorData,
      });
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw ErrorFactory.networkError(
      `Failed to complete questionnaire: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        url,
        operation: 'complete_questionnaire',
        originalError: error,
      },
    );
  }
};
