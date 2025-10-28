export const COLOR_PALETTE = {
  backgroundPrimary: '#FFFFFF',
  backgroundMuted: '#F8FAFC',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  accentPrimary: '#7C3AED',
  accentMuted: '#DDD6FE',
  borderDefault: '#E2E8F0',
  systemError: '#DC2626',
};

export type ColorToken = keyof typeof COLOR_PALETTE;

export const getColor = (token: ColorToken) => COLOR_PALETTE[token];
