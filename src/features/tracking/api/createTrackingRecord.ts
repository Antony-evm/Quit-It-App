import { API_BASE_URL } from '@/shared/api/apiConfig';

const TRACKING_ENDPOINT = `${API_BASE_URL}/api/v1/tracking`;

export type CreateTrackingRecordPayload = {
  user_id: number;
  tracking_type_id: number;
  event_at: string; // ISO datetime string
  note?: string | null;
};

export const createTrackingRecord = async (
  payload: CreateTrackingRecordPayload,
): Promise<void> => {
  const response = await fetch(TRACKING_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create tracking record');
  }
};
