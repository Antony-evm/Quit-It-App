/**
 * Standardized border radius values used throughout the app
 * This ensures consistency and reduces repetition of hardcoded values
 */
export const BORDER_RADIUS = {
  none: 0,
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
  round: 50,
  full: 999,
} as const;

export type BorderRadiusToken = keyof typeof BORDER_RADIUS;

export const getBorderRadius = (token: BorderRadiusToken) =>
  BORDER_RADIUS[token];
