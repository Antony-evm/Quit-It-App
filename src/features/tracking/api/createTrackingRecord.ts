import { TRACKING_ENDPOINT } from './endpoints';
import { extractTrackingRecord, TrackingApiSinglePayload } from './transformers';
import type { TrackingRecord } from '../types';

export type CreateTrackingRecordPayload = {
  user_id: number;
  tracking_type_id: number;
  event_at: string;
  note?: string | null;
};

export const createTrackingRecord = async (
  payload: CreateTrackingRecordPayload,
): Promise<TrackingRecord> => {
  const response = await fetch(TRACKING_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create tracking log');
  }

  const data = (await response.json()) as TrackingApiSinglePayload;
  return extractTrackingRecord(data);
};
