import palette from './palette.json';

export const COLOR_PALETTE = Object.freeze(palette.tokens);

export type ColorToken = keyof typeof COLOR_PALETTE;

export const getColor = (token: ColorToken) => COLOR_PALETTE[token];

export const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
