import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { CRAVINGS_ANALYTICS_ENDPOINT } from './endpoints';
import { CravingAnalyticsResponse } from '../types';

export type CravingAnalyticsApiPayload = {
  data: CravingAnalyticsResponse;
};

export const fetchCravingAnalytics =
  async (): Promise<CravingAnalyticsResponse> => {
    const url = CRAVINGS_ANALYTICS_ENDPOINT;

    try {
      const response = await authenticatedGet(url);

      if (!response.ok) {
        throw ErrorFactory.networkError(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const result: CravingAnalyticsApiPayload = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.networkError(error.message);
      }
      throw ErrorFactory.networkError(
        'Unknown error occurred while fetching craving analytics',
      );
    }
  };
