import React, { PropsWithChildren } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

import { COLOR_PALETTE, TYPOGRAPHY, TypographyVariant } from '../../theme';

type TextTone =
  | 'primary'
  | 'secondary'
  | 'inverse'
  | 'muted'
  | 'success'
  | 'error'
  | 'brand';

export type AppTextProps = PropsWithChildren<
  TextProps & {
    variant?: TypographyVariant;
    tone?: TextTone;
    link?: boolean;
    bold?: boolean;
    centered?: boolean;
  }
>;

const toneToColorMap: Record<TextTone, string> = {
  primary: COLOR_PALETTE.textPrimary,
  secondary: COLOR_PALETTE.textSecondary,
  inverse: COLOR_PALETTE.backgroundPrimary,
  muted: COLOR_PALETTE.textMuted,
  success: COLOR_PALETTE.systemSuccess,
  error: COLOR_PALETTE.systemError,
  brand: COLOR_PALETTE.brandPrimary,
};

export const AppText = ({
  children,
  style,
  variant = 'body',
  tone = 'primary',
  link = false,
  bold = false,
  centered = false,
  ...textProps
}: AppTextProps) => {
  const variantStyle = TYPOGRAPHY[variant] ?? TYPOGRAPHY.body;
  const toneColor = toneToColorMap[tone] ?? COLOR_PALETTE.textPrimary;
  const linkStyle = link ? { textDecorationLine: 'underline' as const } : {};
  const boldStyle = bold ? { fontWeight: '600' as const } : {};
  const centeredStyle = centered ? { textAlign: 'center' as const } : {};

  return (
    <Text
      style={[
        styles.base,
        variantStyle,
        { color: toneColor },
        linkStyle,
        boldStyle,
        centeredStyle,
        style,
      ]}
      {...textProps}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    marginBottom: 0,
  },
});
