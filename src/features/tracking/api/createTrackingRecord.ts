import { authenticatedPost } from '@/shared/api/apiConfig';
import { API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import type { TrackingRecordApiResponse } from './fetchTrackingRecords';

const TRACKING_ENDPOINT = `${API_BASE_URL}/api/v1/tracking`;

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
