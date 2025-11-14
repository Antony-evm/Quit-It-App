import { TRACKING_DEFAULT_PARAMS, TRACKING_ENDPOINT } from './endpoints';
import type { TrackingRecord, TrackingRecordsPage } from '../types';
import {
  extractTrackingRecords,
  TrackingApiRecordsPayload,
} from './transformers';

export type FetchTrackingRecordsOptions = {
  userId: number;
  offset?: number;
  trackingTypeId?: number | null;
};

const buildQueryString = (
  userId: number,
  offset: number,
  trackingTypeId: number | null | undefined,
) => {
  const parts = [
    `user_id=${encodeURIComponent(String(userId))}`,
    `offset=${encodeURIComponent(String(offset))}`,
  ];

  if (typeof trackingTypeId === 'number') {
    parts.push(`tracking_type=${encodeURIComponent(String(trackingTypeId))}`);
  }

  return parts.join('&');
};

export const fetchTrackingRecords = async (
  options: FetchTrackingRecordsOptions,
): Promise<TrackingRecordsPage> => {
  const offset = options.offset ?? TRACKING_DEFAULT_PARAMS.offset;
  const trackingTypeId =
    options.trackingTypeId ?? TRACKING_DEFAULT_PARAMS.trackingTypeId;

  const queryString = buildQueryString(options.userId, offset, trackingTypeId);
  const requestUrl = `${TRACKING_ENDPOINT}?${queryString}`;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error('Failed to load tracking logs');
  }

  const payload = (await response.json()) as TrackingApiRecordsPayload;
  const records = extractTrackingRecords(payload);

  return {
    offset,
    records,
  };
};
