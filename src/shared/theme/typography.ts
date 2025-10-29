export const TYPOGRAPHY = {
  title: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  heading: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
};

export type TypographyVariant = keyof typeof TYPOGRAPHY;
