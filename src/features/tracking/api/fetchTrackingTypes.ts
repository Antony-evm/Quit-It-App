import type { TrackingType } from '../types';
import { TRACKING_TYPES_ENDPOINT } from './endpoints';

type TrackingTypeApiRecord = {
  tracking_type_id: number;
  display_name: string;
  code: string;
  description: string;
  is_default: boolean;
};

type TrackingTypesApiResponse = {
  data: {
    tracking_types: TrackingTypeApiRecord[];
  };
};

const mapTrackingType = (record: TrackingTypeApiRecord): TrackingType => ({
  id: record.tracking_type_id,
  displayName: record.display_name,
  code: record.code,
  description: record.description,
  is_default: record.is_default,
});

const extractRecords = (
  payload: TrackingTypesApiResponse,
): TrackingTypeApiRecord[] => {
  return payload.data.tracking_types;
};

export const fetchTrackingTypes = async (): Promise<TrackingType[]> => {
  const response = await fetch(TRACKING_TYPES_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to load tracking types');
  }

  const payload = (await response.json()) as TrackingTypesApiResponse;
  return extractRecords(payload).map(mapTrackingType);
};
