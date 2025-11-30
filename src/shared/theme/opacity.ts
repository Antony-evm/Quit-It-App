export const OPACITY = {
  transparent: 0,
  skeleton: 0.3,
  disabled: 0.5,
  medium: 0.7,
  high: 0.8,
  opaque: 1,
} as const;

export type Opacity = keyof typeof OPACITY;
