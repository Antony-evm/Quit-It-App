import { authenticatedPost } from '@/shared/api/apiConfig';
import { API_BASE_URL } from '@/shared/api/apiConfig';
import type { TrackingRecordApiResponse } from './fetchTrackingRecords';

const TRACKING_ENDPOINT = `${API_BASE_URL}/api/v1/tracking`;

export type CreateTrackingRecordPayload = {
  user_id: number;
  tracking_type_id: number;
  event_at: string; // ISO datetime string
  note?: string | null;
};

export type CreateTrackingRecordResponse = {
  data: TrackingRecordApiResponse;
};

export const createTrackingRecord = async (
  payload: CreateTrackingRecordPayload,
): Promise<TrackingRecordApiResponse> => {
  const response = await authenticatedPost(TRACKING_ENDPOINT, payload);

  if (!response.ok) {
    throw new Error('Failed to create tracking record');
  }

  const result = (await response.json()) as CreateTrackingRecordResponse;
  return result.data;
};
