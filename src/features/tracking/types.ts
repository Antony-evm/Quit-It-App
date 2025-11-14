export type TrackingRecord = {
  id: number;
  userId: number;
  trackingTypeId: number;
  eventAt: string;
  note: string | null;
};

export type TrackingRecordsPage = {
  offset: number;
  records: TrackingRecord[];
};

export type TrackingType = {
  id: number;
  displayName: string;
  code: string;
  description: string;
};
