import { apiGet } from '@/shared/api/apiConfig';
import { CRAVINGS_ANALYTICS_ENDPOINT } from './endpoints';
import { CravingAnalyticsResponse } from '../types';

export type CravingAnalyticsApiPayload = {
  data: CravingAnalyticsResponse;
};

export const fetchCravingAnalytics =
  async (): Promise<CravingAnalyticsResponse> => {
    const response = await apiGet(CRAVINGS_ANALYTICS_ENDPOINT);

    if (!response.ok) {
      throw new Error('Failed to fetch craving analytics');
    }

    const result: CravingAnalyticsApiPayload = await response.json();
    return result.data;
  };
