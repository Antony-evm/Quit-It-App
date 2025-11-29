import palette from './palette.json';

export const COLOR_PALETTE = Object.freeze(palette.tokens);

export type ColorToken = keyof typeof COLOR_PALETTE;

export const getColor = (token: ColorToken) => COLOR_PALETTE[token];
