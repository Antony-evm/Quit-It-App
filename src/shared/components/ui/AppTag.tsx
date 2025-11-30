import React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { AppPressable } from './AppPressable';
import { Box } from './Box';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';

export type AppTagProps = {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'pill' | 'rounded';
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const AppTag = ({
  label,
  color,
  textColor,
  size = 'medium',
  variant = 'pill',
  onPress,
  selected = false,
  style,
  textStyle,
}: AppTagProps) => {
  const isPill = variant === 'pill';
  const borderRadius = isPill ? 'full' : 'medium';

  // Default colors
  const defaultBg = selected
    ? COLOR_PALETTE.textPrimary
    : COLOR_PALETTE.backgroundMuted;
  const backgroundColor = color || defaultBg;

  const defaultText = selected
    ? COLOR_PALETTE.backgroundPrimary
    : COLOR_PALETTE.textPrimary;
  const finalTextColor = textColor || defaultText;

  const getTextStyles = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const getPaddingVertical = () => {
    if (variant === 'rounded') return SPACING.sm;
    return SPACING.xs;
  };

  const content = (
    <AppText
      style={[
        styles.textBase,
        getTextStyles(),
        { color: finalTextColor },
        textStyle,
      ]}
    >
      {label}
    </AppText>
  );

  if (onPress) {
    return (
      <AppPressable
        onPress={onPress}
        style={[
          styles.pressableBase,
          {
            backgroundColor,
            borderRadius: isPill ? 9999 : BORDER_RADIUS.medium,
            borderColor: selected
              ? COLOR_PALETTE.textPrimary
              : COLOR_PALETTE.borderDefault,
            borderWidth: 1,
            paddingVertical: getPaddingVertical(),
          },
          style,
        ]}
      >
        {content}
      </AppPressable>
    );
  }

  return (
    <Box
      px="md"
      py={size === 'small' ? 'xs' : 'xs'}
      borderRadius={borderRadius}
      style={[{ backgroundColor }, style, { alignSelf: 'flex-start' }]}
    >
      {content}
    </Box>
  );
};

const styles = StyleSheet.create({
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  pressableBase: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
