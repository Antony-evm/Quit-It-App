import { authenticatedFetch, API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';

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

  try {
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

      throw ErrorFactory.apiError(
        response.status,
        errorText || 'Failed to update tracking record',
        {
          recordId,
          payload,
          url,
          operation: 'update_tracking_record',
        },
      );
    }

    console.log('Tracking record updated successfully');
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw ErrorFactory.networkError(
      `Failed to update tracking record: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        recordId,
        payload,
        url,
        operation: 'update_tracking_record',
        originalError: error,
      },
    );
  }
};
