import { authenticatedFetch, API_BASE_URL } from '@/shared/api/apiConfig';

export type UpdateTrackingRecordPayload = {
  event_at: string; // ISO datetime string
  note?: string;
  tracking_type_id: number;
};

export const updateTrackingRecord = async (
  recordId: number,
  payload: UpdateTrackingRecordPayload,
): Promise<void> => {
  const url = `${API_BASE_URL}/api/v1/tracking/${recordId}`;

  console.log('Updating tracking record:', { recordId, payload, url });

  const response = await authenticatedFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update tracking record failed:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });

    throw new Error(
      `Failed to update tracking record: ${response.status} ${response.statusText}`,
    );
  }

  console.log('Tracking record updated successfully');
};
