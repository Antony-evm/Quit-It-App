export const TYPOGRAPHY = {
  display: {
    fontFamily: 'System',
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48,
  },
  title: {
    fontFamily: 'System',
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 34,
  },
  heading: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  body: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  subcaption: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  gridArea: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
};

export type TypographyVariant = keyof typeof TYPOGRAPHY;
