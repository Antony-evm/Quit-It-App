import { authenticatedGet } from '@/shared/api/apiConfig';
import { API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';

const TRACKING_RECORDS_ENDPOINT = `${API_BASE_URL}/api/v1/tracking`;

export type TrackingRecordApiResponse = {
  record_id: number;
  user_id: number;
  tracking_type_id: number;
  event_at: string; // ISO datetime string
  note: string | null;
};

export type TrackingRecordsApiPayload = {
  data: {
    tracking_records: TrackingRecordApiResponse[];
  };
};

export type FetchTrackingRecordsOptions = {
  user_id: number;
  offset?: number;
};

export const fetchTrackingRecords = async (
  options: FetchTrackingRecordsOptions,
): Promise<TrackingRecordApiResponse[]> => {
  const { user_id, offset = 0 } = options;

  const queryParams = new URLSearchParams({
    user_id: user_id.toString(),
    offset: offset.toString(),
  });

  const url = `${TRACKING_RECORDS_ENDPOINT}?${queryParams}`;

  try {
    const response = await authenticatedGet(url);

    if (!response.ok) {
      const errorText = await response.text();

      throw ErrorFactory.apiError(
        response.status,
        errorText || 'Failed to fetch tracking records',
        {
          options,
          url,
          operation: 'fetch_tracking_records',
        },
      );
    }

    const payload = (await response.json()) as TrackingRecordsApiPayload;
    return payload.data.tracking_records;
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw ErrorFactory.networkError(
      `Failed to fetch tracking records: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        options,
        url,
        operation: 'fetch_tracking_records',
        originalError: error,
      },
    );
  }
};
