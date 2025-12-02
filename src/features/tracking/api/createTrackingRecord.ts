import { apiPost } from '@/shared/api/apiConfig';
import { TRACKING_ENDPOINT } from './endpoints';
import type { TrackingRecordApiResponse } from './fetchTrackingRecords';

export type CreateTrackingRecordPayload = {
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
  const response = await apiPost(TRACKING_ENDPOINT, payload);

  if (!response.ok) {
    throw new Error('Failed to create tracking record');
  }

  const result = (await response.json()) as CreateTrackingRecordResponse;
  return result.data;
};
