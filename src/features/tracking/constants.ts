import { TAGS, SYSTEM } from '@/shared/theme';

// Pagination constants
export const TRACKING_RECORDS_PAGE_SIZE = 10;

// Tracking type codes
export const TRACKING_TYPE_CODES = {
  CRAVING: 'craving',
  CIGARETTE: 'cigarette',
} as const;

export type TrackingTypeCode =
  (typeof TRACKING_TYPE_CODES)[keyof typeof TRACKING_TYPE_CODES];

// Color configuration for tracking types
export type TrackingTypeColors = {
  accent: string;
};

export const TRACKING_TYPE_COLORS: Record<string, TrackingTypeColors> = {
  [TRACKING_TYPE_CODES.CRAVING]: {
    accent: TAGS.craving,
  },
  [TRACKING_TYPE_CODES.CIGARETTE]: {
    accent: TAGS.cigarette,
  },
};

export const DEFAULT_TRACKING_TYPE_COLORS: TrackingTypeColors = {
  accent: SYSTEM.border,
};

/**
 * Get colors for a tracking type by code
 */
export const getTrackingTypeColors = (
  typeCode: string | undefined,
): TrackingTypeColors => {
  if (!typeCode) return DEFAULT_TRACKING_TYPE_COLORS;
  return TRACKING_TYPE_COLORS[typeCode] || DEFAULT_TRACKING_TYPE_COLORS;
};
