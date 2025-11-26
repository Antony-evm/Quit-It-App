import { API_BASE_URL } from '@/shared/api/apiConfig';

export const TRACKING_TYPES_ENDPOINT = `${API_BASE_URL}/api/v1/tracking/types`;

export const TRACKING_ENDPOINT = `${API_BASE_URL}/api/v1/tracking`;

export const CRAVINGS_ANALYTICS_ENDPOINT = `${API_BASE_URL}/api/v1/tracking/cravings/analytics`;

export const TRACKING_DEFAULT_PARAMS = {
  offset: 0,
  trackingTypeId: null as number | null,
};
