import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { QUESTIONNAIRE_FREQUENCY_ENDPOINT } from './endpoints';

const OPERATION = 'fetch_frequency';

export type FrequencyData = Record<string, string>;

interface FetchFrequencyResponse {
  data: FrequencyData;
}

export async function fetchFrequency(): Promise<FrequencyData> {
  try {
    const response = await authenticatedGet(QUESTIONNAIRE_FREQUENCY_ENDPOINT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw ErrorFactory.apiError(
        response.status,
        errorData.message || 'Failed to fetch frequency data',
        {
          url: QUESTIONNAIRE_FREQUENCY_ENDPOINT,
          operation: OPERATION,
          errorData,
        },
      );
    }

    const responseData: FetchFrequencyResponse = await response.json();
    return responseData.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    throw ErrorFactory.networkError(
      `Failed to fetch frequency data: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        url: QUESTIONNAIRE_FREQUENCY_ENDPOINT,
        operation: OPERATION,
        originalError: error,
      },
    );
  }
}
