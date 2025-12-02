import { apiPost, API_BASE_URL } from '@/shared/api/apiConfig';
import type { UserDataResponse } from '@/shared/types/api';

const SUBSCRIPTION_ENDPOINT = `${API_BASE_URL}/api/v1/subscription`;

export interface SubscriptionResponse extends UserDataResponse {}

/**
 * Subscribe user by calling authenticated POST to /api/v1/subscription
 */
export const subscribeUser = async (): Promise<SubscriptionResponse> => {
  try {
    const response = await apiPost(SUBSCRIPTION_ENDPOINT);

    if (!response.ok) {
      // Try to get the error response body for better debugging
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText ? ` - ${errorText}` : '';
      } catch (parseError) {}

      throw new Error(
        `Subscription failed: ${response.status} ${response.statusText}${errorDetails}`,
      );
    }

    const data: SubscriptionResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Subscription failed',
    );
  }
};
