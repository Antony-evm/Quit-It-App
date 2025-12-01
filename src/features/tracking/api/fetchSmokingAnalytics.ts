import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { SMOKES_ANALYTICS_ENDPOINT } from './endpoints';
import { SmokingAnalyticsResponse } from '../types';

export type SmokingAnalyticsApiPayload = {
  data: SmokingAnalyticsResponse;
};

export const fetchSmokingAnalytics =
  async (): Promise<SmokingAnalyticsResponse> => {
    try {
      const response = await authenticatedGet(SMOKES_ANALYTICS_ENDPOINT);

      if (!response.ok) {
        const errorText = await response.text();
        throw ErrorFactory.apiError(
          response.status,
          errorText || 'Failed to fetch smoking analytics',
          {
            endpoint: SMOKES_ANALYTICS_ENDPOINT,
            operation: 'fetch_smoking_analytics',
          },
        );
      }

      const result: SmokingAnalyticsApiPayload = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AppError') {
        throw error;
      }

      throw ErrorFactory.networkError(
        `Failed to fetch smoking analytics: ${
          error instanceof Error ? error.message : String(error)
        }`,
        {
          endpoint: SMOKES_ANALYTICS_ENDPOINT,
          operation: 'fetch_smoking_analytics',
          originalError: error,
        },
      );
    }
  };
