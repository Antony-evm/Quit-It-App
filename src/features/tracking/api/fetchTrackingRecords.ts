import { API_BASE_URL } from '@/shared/api/apiConfig';

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

  const response = await fetch(`${TRACKING_RECORDS_ENDPOINT}?${queryParams}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tracking records');
  }

  const payload = (await response.json()) as TrackingRecordsApiPayload;
  return payload.data.tracking_records;
};
