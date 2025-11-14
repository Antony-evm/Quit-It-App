import type { TrackingRecord } from '../types';

export type TrackingApiRecord = {
  record_id: number;
  user_id: number;
  tracking_type_id: number;
  event_at: string;
  note?: string | null;
};

type TrackingApiRecordCollection = {
  records?: TrackingApiRecord[];
  tracking_records?: TrackingApiRecord[];
};

export type TrackingApiRecordsPayload =
  | TrackingApiRecord[]
  | TrackingApiRecordCollection
  | {
      data?: TrackingApiRecordCollection;
    };

export type TrackingApiSinglePayload =
  | TrackingApiRecord
  | {
      record?: TrackingApiRecord;
    }
  | {
      data?: TrackingApiRecord;
    };

const normalizeTimestamp = (value: string): string => {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toISOString();
};

export const mapTrackingApiRecord = (
  record: TrackingApiRecord,
): TrackingRecord => ({
  id: record.record_id,
  userId: record.user_id,
  trackingTypeId: record.tracking_type_id,
  eventAt: normalizeTimestamp(record.event_at),
  note: record.note ?? null,
});

const resolveCollectionRecords = (
  collection?: TrackingApiRecordCollection,
): TrackingApiRecord[] => {
  if (!collection) {
    return [];
  }

  if (Array.isArray(collection.records) && collection.records.length) {
    return collection.records;
  }

  if (
    Array.isArray(collection.tracking_records) &&
    collection.tracking_records.length
  ) {
    return collection.tracking_records;
  }

  return [];
};

export const extractTrackingRecords = (
  payload: TrackingApiRecordsPayload,
): TrackingRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map(mapTrackingApiRecord);
  }

  if ('records' in payload || 'tracking_records' in payload) {
    const records = resolveCollectionRecords(payload);
    return records.map(mapTrackingApiRecord);
  }

  if ('data' in payload) {
    const records = resolveCollectionRecords(payload.data);
    return records.map(mapTrackingApiRecord);
  }

  return [];
};

export const extractTrackingRecord = (
  payload: TrackingApiSinglePayload,
): TrackingRecord => {
  if (Array.isArray(payload)) {
    return mapTrackingApiRecord(payload[0]!);
  }

  if ('record' in payload && payload.record) {
    return mapTrackingApiRecord(payload.record);
  }

  if ('data' in payload && payload.data) {
    return mapTrackingApiRecord(payload.data);
  }

  return mapTrackingApiRecord(payload as TrackingApiRecord);
};
