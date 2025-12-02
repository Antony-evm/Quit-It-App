import { apiFetch } from '@/shared/api/apiConfig';
import { TRACKING_ENDPOINT } from './endpoints';

export type UpdateTrackingRecordPayload = {
  event_at: string; // ISO datetime string
  note?: string;
  tracking_type_id: number;
};

export const updateTrackingRecord = async (
  recordId: number,
  payload: UpdateTrackingRecordPayload,
): Promise<void> => {
  const url = `${TRACKING_ENDPOINT}/${recordId}`;
  const response = await apiFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update tracking record');
  }
};
