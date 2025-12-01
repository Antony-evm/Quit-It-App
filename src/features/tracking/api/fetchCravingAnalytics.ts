import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { CRAVINGS_ANALYTICS_ENDPOINT } from './endpoints';
import { CravingAnalyticsResponse } from '../types';

export type CravingAnalyticsApiPayload = {
  data: CravingAnalyticsResponse;
};

export const fetchCravingAnalytics =
  async (): Promise<CravingAnalyticsResponse> => {
    try {
      const response = await authenticatedGet(CRAVINGS_ANALYTICS_ENDPOINT);

      if (!response.ok) {
        const errorText = await response.text();
        throw ErrorFactory.apiError(
          response.status,
          errorText || 'Failed to fetch craving analytics',
          {
            endpoint: CRAVINGS_ANALYTICS_ENDPOINT,
            operation: 'fetch_craving_analytics',
          },
        );
      }

      const result: CravingAnalyticsApiPayload = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AppError') {
        throw error;
      }

      throw ErrorFactory.networkError(
        `Failed to fetch craving analytics: ${
          error instanceof Error ? error.message : String(error)
        }`,
        {
          endpoint: CRAVINGS_ANALYTICS_ENDPOINT,
          operation: 'fetch_craving_analytics',
          originalError: error,
        },
      );
    }
  };
