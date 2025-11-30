import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { Box } from './Box';
import type { AppTextProps } from './AppText';

type HeaderAlignment = 'left' | 'center' | 'right';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  align?: HeaderAlignment;
  titleVariant?: AppTextProps['variant'];
  subtitleVariant?: AppTextProps['variant'];
  subtitleTone?: AppTextProps['tone'];
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginBottom?: number;
  style?: StyleProp<ViewStyle>;
};

export const ScreenHeader = ({
  title,
  subtitle,
  align = 'left',
  titleVariant = 'title',
  subtitleVariant = 'body',
  subtitleTone = 'primary',
  paddingHorizontal,
  paddingVertical,
  marginBottom,
  style,
}: ScreenHeaderProps) => {
  const alignmentStyle =
    align === 'center'
      ? styles.centered
      : align === 'right'
      ? styles.rightAligned
      : styles.leftAligned;

  return (
    <Box
      style={[
        alignmentStyle,
        {
          paddingHorizontal,
          paddingVertical,
          marginBottom,
        },
        style,
      ]}
      gap="md"
    >
      <AppText
        variant={titleVariant}
        style={[styles.title, { textAlign: align }]}
      >
        {title}
      </AppText>
      {subtitle ? (
        <AppText
          variant={subtitleVariant}
          tone={subtitleTone}
          style={[styles.subtitle, { textAlign: align }]}
        >
          {subtitle}
        </AppText>
      ) : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {},
  subtitle: {},
  centered: {
    alignItems: 'center',
  },
  rightAligned: {
    alignItems: 'flex-end',
  },
  leftAligned: {
    alignItems: 'flex-start',
  },
});
