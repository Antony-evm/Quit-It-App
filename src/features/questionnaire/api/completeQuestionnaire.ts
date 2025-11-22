import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { QUESTIONNAIRE_COMPLETE_ENDPOINT } from './endpoints';
import type { QuestionnaireCompleteResponse } from '../types';

/**
 * Complete the questionnaire and get user status information
 */
export const completeQuestionnaire =
  async (): Promise<QuestionnaireCompleteResponse> => {
    try {
      console.log(
        'Making questionnaire completion request to:',
        QUESTIONNAIRE_COMPLETE_ENDPOINT,
      );

      const response = await authenticatedGet(QUESTIONNAIRE_COMPLETE_ENDPOINT);

      console.log('Questionnaire completion response status:', response.status);
      console.log(
        'Questionnaire completion response headers:',
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || 'Failed to complete questionnaire';

        throw ErrorFactory.apiError(response.status, errorMessage, {
          url: QUESTIONNAIRE_COMPLETE_ENDPOINT,
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
          url: QUESTIONNAIRE_COMPLETE_ENDPOINT,
          operation: 'complete_questionnaire',
          originalError: error,
        },
      );
    }
  };
