import palette from './palette.json';

// Organized palette groups
export const BACKGROUND = Object.freeze(palette.background);
export const TEXT = Object.freeze(palette.text);
export const TAGS = Object.freeze(palette.tags);
export const SYSTEM = Object.freeze(palette.system);

// Legacy flat export for backward compatibility
export const COLOR_PALETTE = Object.freeze(palette.tokens);

export type ColorToken = keyof typeof COLOR_PALETTE;
export type BackgroundToken = keyof typeof BACKGROUND;
export type TextToken = keyof typeof TEXT;
export type TagToken = keyof typeof TAGS;
export type SystemToken = keyof typeof SYSTEM;

export const getColor = (token: ColorToken) => COLOR_PALETTE[token];

export const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
