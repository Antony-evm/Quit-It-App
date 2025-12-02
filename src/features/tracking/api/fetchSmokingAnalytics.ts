import { apiGet } from '@/shared/api/apiConfig';
import { SMOKES_ANALYTICS_ENDPOINT } from './endpoints';
import { SmokingAnalyticsResponse } from '../types';

export type SmokingAnalyticsApiPayload = {
  data: SmokingAnalyticsResponse;
};

export const fetchSmokingAnalytics =
  async (): Promise<SmokingAnalyticsResponse> => {
    const response = await apiGet(SMOKES_ANALYTICS_ENDPOINT);

    if (!response.ok) {
      throw new Error('Failed to fetch smoking analytics');
    }

    const result: SmokingAnalyticsApiPayload = await response.json();
    return {
      ...result.data,
      last_smoking_day: new Date(result.data.last_smoking_day),
    };
  };
