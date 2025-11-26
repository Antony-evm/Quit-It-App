import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { CRAVINGS_ANALYTICS_ENDPOINT } from './endpoints';
import { CravingAnalyticsResponse } from '../types';

export type CravingAnalyticsApiPayload = {
  data: CravingAnalyticsResponse;
};

export type FetchCravingAnalyticsOptions = {
  user_id: number;
};

export const fetchCravingAnalytics = async (
  options: FetchCravingAnalyticsOptions,
): Promise<CravingAnalyticsResponse> => {
  const { user_id } = options;

  const queryParams = new URLSearchParams({
    user_id: user_id.toString(),
  });

  const url = `${CRAVINGS_ANALYTICS_ENDPOINT}?${queryParams}`;

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
