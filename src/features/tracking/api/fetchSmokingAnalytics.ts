import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { SMOKES_ANALYTICS_ENDPOINT } from './endpoints';
import { SmokingAnalyticsResponse } from '../types';

export type SmokingAnalyticsApiPayload = {
  data: SmokingAnalyticsResponse;
};

export type FetchSmokingAnalyticsOptions = {
  user_id: number;
};

export const fetchSmokingAnalytics = async (
  options: FetchSmokingAnalyticsOptions,
): Promise<SmokingAnalyticsResponse> => {
  const { user_id } = options;

  const queryParams = new URLSearchParams({
    user_id: user_id.toString(),
  });

  const url = `${SMOKES_ANALYTICS_ENDPOINT}?${queryParams}`;

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