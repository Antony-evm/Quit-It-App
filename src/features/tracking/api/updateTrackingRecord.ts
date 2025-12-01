import { authenticatedFetch } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { TRACKING_ENDPOINT } from './endpoints';

export type UpdateTrackingRecordPayload = {
  event_at: string; // ISO datetime string
  note?: string;
  tracking_type_id: number;
};

const validateInput = (
  recordId: number,
  payload: UpdateTrackingRecordPayload,
): void => {
  if (!recordId || recordId <= 0) {
    throw ErrorFactory.validationError('recordId', 'Invalid record ID');
  }

  if (!payload.tracking_type_id || payload.tracking_type_id <= 0) {
    throw ErrorFactory.validationError(
      'tracking_type_id',
      'Please select a valid tracking type',
    );
  }

  if (!payload.event_at) {
    throw ErrorFactory.validationError(
      'event_at',
      'Please select a valid date and time',
    );
  }

  const date = new Date(payload.event_at);
  if (isNaN(date.getTime())) {
    throw ErrorFactory.validationError(
      'event_at',
      'Invalid date format. Please use a valid date.',
    );
  }
};

export const updateTrackingRecord = async (
  recordId: number,
  payload: UpdateTrackingRecordPayload,
): Promise<void> => {
  validateInput(recordId, payload);

  const url = `${TRACKING_ENDPOINT}/${recordId}`;

  try {
    const response = await authenticatedFetch(url, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
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
