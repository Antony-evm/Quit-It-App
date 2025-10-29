export const SPACING = {
  zero: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export type SpacingToken = keyof typeof SPACING;

export const getSpacing = (token: SpacingToken) => SPACING[token];
