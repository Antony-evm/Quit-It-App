import { apiGet } from '@/shared/api/apiConfig';
import { TRACKING_ENDPOINT } from './endpoints';

export type TrackingRecordApiResponse = {
  record_id: number;
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
  offset?: number;
};

export const fetchTrackingRecords = async (
  options: FetchTrackingRecordsOptions = {},
): Promise<TrackingRecordApiResponse[]> => {
  const { offset = 0 } = options;

  const queryParams = new URLSearchParams({
    offset: offset.toString(),
  });

  const url = `${TRACKING_ENDPOINT}?${queryParams}`;
  const response = await apiGet(url);

  if (!response.ok) {
    throw new Error('Failed to fetch tracking records');
  }

  const payload = (await response.json()) as TrackingRecordsApiPayload;
  return payload.data.tracking_records;
};
