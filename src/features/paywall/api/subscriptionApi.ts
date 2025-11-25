import { authenticatedPost, API_BASE_URL } from '@/shared/api/apiConfig';
import type { UserDataResponse } from '@/shared/types/api';

const SUBSCRIPTION_ENDPOINT = `${API_BASE_URL}/api/v1/subscription`;

export interface SubscriptionResponse extends UserDataResponse {}

/**
 * Subscribe user by calling authenticated POST to /api/v1/subscription
 */
export const subscribeUser = async (): Promise<SubscriptionResponse> => {
  try {
    console.log(
      '[SubscriptionAPI] Making subscription request to:',
      SUBSCRIPTION_ENDPOINT,
    );
    const response = await authenticatedPost(SUBSCRIPTION_ENDPOINT);

    console.log(
      '[SubscriptionAPI] Response status:',
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      // Try to get the error response body for better debugging
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText ? ` - ${errorText}` : '';
        console.error('[SubscriptionAPI] Error response body:', errorText);
      } catch (parseError) {
        console.error(
          '[SubscriptionAPI] Could not parse error response:',
          parseError,
        );
      }

      throw new Error(
        `Subscription failed: ${response.status} ${response.statusText}${errorDetails}`,
      );
    }

    const data: SubscriptionResponse = await response.json();
    console.log('[SubscriptionAPI] Success response:', data);
    return data;
  } catch (error) {
    console.error('[SubscriptionAPI] Subscription error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Subscription failed',
    );
  }
};
