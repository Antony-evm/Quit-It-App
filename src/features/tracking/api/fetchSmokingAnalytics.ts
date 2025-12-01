import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { SMOKES_ANALYTICS_ENDPOINT } from './endpoints';
import { SmokingAnalyticsResponse } from '../types';

export type SmokingAnalyticsApiPayload = {
  data: SmokingAnalyticsResponse;
};

export const fetchSmokingAnalytics =
  async (): Promise<SmokingAnalyticsResponse> => {
    const url = SMOKES_ANALYTICS_ENDPOINT;

    try {
      const response = await authenticatedGet(url);

      if (!response.ok) {
        throw ErrorFactory.networkError(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const result: SmokingAnalyticsApiPayload = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.networkError(error.message);
      }
      throw ErrorFactory.networkError(
        'Unknown error occurred while fetching smoking analytics',
      );
    }
  };
