import React, { PropsWithChildren } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

import {
  BACKGROUND,
  TEXT,
  SYSTEM,
  TYPOGRAPHY,
  TypographyVariant,
} from '../../theme';

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
    italic?: boolean;
  }
>;

const toneToColorMap: Record<TextTone, string> = {
  primary: TEXT.primary,
  secondary: TEXT.secondary,
  inverse: BACKGROUND.primary,
  muted: TEXT.muted,
  success: SYSTEM.success,
  error: SYSTEM.error,
  brand: SYSTEM.brand,
};

export const AppText = ({
  children,
  style,
  variant = 'body',
  tone = 'primary',
  link = false,
  bold = false,
  centered = false,
  italic = false,
  ...textProps
}: AppTextProps) => {
  const variantStyle = TYPOGRAPHY[variant] ?? TYPOGRAPHY.body;
  const toneColor = toneToColorMap[tone] ?? TEXT.primary;
  const linkStyle = link ? { textDecorationLine: 'underline' as const } : {};
  const boldStyle = bold ? { fontWeight: '600' as const } : {};
  const centeredStyle = centered ? { textAlign: 'center' as const } : {};
  const italicStyle = italic ? { fontStyle: 'italic' as const } : {};

  return (
    <Text
      style={[
        styles.base,
        variantStyle,
        { color: toneColor },
        linkStyle,
        boldStyle,
        centeredStyle,
        italicStyle,
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
