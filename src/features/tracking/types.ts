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
  is_default: boolean;
};

export type DailyCravingData = {
  date: string; // YYYY-MM-DD format
  count: number;
};

export type CravingAnalyticsResponse = {
  total_cravings: number;
  days_with_cravings: number;
  cravings_by_day: Record<string, number>; // { "2025-11-25": 1, "2025-11-26": 3 }
};

export type SmokingAnalyticsResponse = {
  last_smoking_day: Date;
  total_smokes: number;
  skipped_smokes: number;
  skipped_smokes_per_day: number;
  savings_per_day: number;
  savings: number;
};
