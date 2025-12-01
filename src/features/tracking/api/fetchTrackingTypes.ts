import { authenticatedGet } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
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
  try {
    const response = await authenticatedGet(TRACKING_TYPES_ENDPOINT);

    if (!response.ok) {
      const errorText = await response.text();
      throw ErrorFactory.apiError(
        response.status,
        errorText || 'Failed to fetch tracking types',
        {
          endpoint: TRACKING_TYPES_ENDPOINT,
          operation: 'fetch_tracking_types',
        },
      );
    }

    const payload = (await response.json()) as TrackingTypesApiResponse;
    return extractRecords(payload).map(mapTrackingType);
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    throw ErrorFactory.networkError(
      `Failed to fetch tracking types: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        endpoint: TRACKING_TYPES_ENDPOINT,
        operation: 'fetch_tracking_types',
        originalError: error,
      },
    );
  }
};
