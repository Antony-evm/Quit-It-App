import { authenticatedPost } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
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

const validatePayload = (payload: CreateTrackingRecordPayload): void => {
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

  // Validate ISO date format
  const date = new Date(payload.event_at);
  if (isNaN(date.getTime())) {
    throw ErrorFactory.validationError(
      'event_at',
      'Invalid date format. Please use a valid date.',
    );
  }
};

export const createTrackingRecord = async (
  payload: CreateTrackingRecordPayload,
): Promise<TrackingRecordApiResponse> => {
  // Validate input before making API call
  validatePayload(payload);

  try {
    const response = await authenticatedPost(TRACKING_ENDPOINT, payload);

    if (!response.ok) {
      const errorText = await response.text();

      throw ErrorFactory.apiError(
        response.status,
        errorText || 'Failed to create tracking record',
        {
          payload,
          endpoint: TRACKING_ENDPOINT,
          operation: 'create_tracking_record',
        },
      );
    }

    const result = (await response.json()) as CreateTrackingRecordResponse;
    return result.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw ErrorFactory.networkError(
      `Failed to create tracking record: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        payload,
        endpoint: TRACKING_ENDPOINT,
        operation: 'create_tracking_record',
        originalError: error,
      },
    );
  }
};
