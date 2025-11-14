import { API_BASE_URL } from '@/shared/api/apiConfig';
import type { TrackingType } from '../types';

const TRACKING_TYPES_ENDPOINT = `${API_BASE_URL}/api/v1/tracking/types`;

type TrackingTypeApiRecord = {
  tracking_type_id: number;
  display_name: string;
  code: string;
  description?: string | null;
};

type TrackingTypesApiResponse =
  | TrackingTypeApiRecord[]
  | {
      data?:
        | TrackingTypeApiRecord[]
        | {
            tracking_types?: TrackingTypeApiRecord[];
          };
    };

const mapTrackingType = (record: TrackingTypeApiRecord): TrackingType => ({
  id: record.tracking_type_id,
  displayName: record.display_name,
  code: record.code,
  description: record.description ?? null,
});

const extractRecords = (
  payload: TrackingTypesApiResponse,
): TrackingTypeApiRecord[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if ('data' in payload) {
    const data = payload.data;

    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    if ('tracking_types' in data && Array.isArray(data.tracking_types)) {
      return data.tracking_types;
    }
  }

  return [];
};

export const fetchTrackingTypes = async (): Promise<TrackingType[]> => {
  const response = await fetch(TRACKING_TYPES_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to load tracking types');
  }

  const payload = (await response.json()) as TrackingTypesApiResponse;
  return extractRecords(payload).map(mapTrackingType);
};
