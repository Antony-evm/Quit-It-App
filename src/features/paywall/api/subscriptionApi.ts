import { authenticatedPost } from '@/shared/api/apiConfig';
import type { UserDataResponse } from '@/shared/types/api';

const SUBSCRIPTION_ENDPOINT = '/api/v1/subscription';

export interface SubscriptionResponse extends UserDataResponse {}

/**
 * Subscribe user by calling authenticated POST to /api/v1/subscription
 */
export const subscribeUser = async (): Promise<SubscriptionResponse> => {
  try {
    const response = await authenticatedPost(SUBSCRIPTION_ENDPOINT);

    if (!response.ok) {
      throw new Error(
        `Subscription failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: SubscriptionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Subscription error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Subscription failed',
    );
  }
};
