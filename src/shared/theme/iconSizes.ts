export const ICON_SIZES = {
  small: 16,
  medium: 24,
  large: 32,
  xlarge: 48,
  jumbo: 100,
} as const;

export type IconSize = keyof typeof ICON_SIZES;
