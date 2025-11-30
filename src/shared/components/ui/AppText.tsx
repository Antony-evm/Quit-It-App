import React, { PropsWithChildren } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

import { COLOR_PALETTE, TYPOGRAPHY, TypographyVariant } from '../../theme';

type TextTone =
  | 'primary'
  | 'secondary'
  | 'inverse'
  | 'muted'
  | 'success'
  | 'error';

export type AppTextProps = PropsWithChildren<
  TextProps & {
    variant?: TypographyVariant;
    tone?: TextTone;
  }
>;

const toneToColorMap: Record<TextTone, string> = {
  primary: COLOR_PALETTE.textPrimary,
  secondary: COLOR_PALETTE.textSecondary,
  inverse: COLOR_PALETTE.backgroundPrimary,
  muted: COLOR_PALETTE.textMuted,
  success: COLOR_PALETTE.systemSuccess,
  error: COLOR_PALETTE.systemError,
};

export const AppText = ({
  children,
  style,
  variant = 'body',
  tone = 'primary',
  ...textProps
}: AppTextProps) => {
  const variantStyle = TYPOGRAPHY[variant] ?? TYPOGRAPHY.body;
  const toneColor = toneToColorMap[tone] ?? COLOR_PALETTE.textPrimary;

  return (
    <Text
      style={[styles.base, variantStyle, { color: toneColor }, style]}
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
