import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Box, BoxProps } from './Box';
import {
  COLOR_PALETTE,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BORDER_WIDTH,
} from '../../theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';
export type CardSize = 'sm' | 'md' | 'lg';

export interface AppCardProps extends BoxProps {
  variant?: CardVariant;
  size?: CardSize;
  style?: StyleProp<ViewStyle>;
}

export const AppCard = ({
  variant = 'elevated',
  size = 'lg',
  children,
  style,
  ...boxProps
}: AppCardProps) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: COLOR_PALETTE.backgroundPrimary,
          borderWidth: BORDER_WIDTH.sm,
          borderColor: COLOR_PALETTE.borderDefault,
          ...SHADOWS.softLg,
        };
      case 'outlined':
        return {
          backgroundColor: COLOR_PALETTE.backgroundPrimary,
          borderWidth: BORDER_WIDTH.sm,
          borderColor: COLOR_PALETTE.borderDefault,
        };
      case 'filled':
        return {
          backgroundColor: COLOR_PALETTE.backgroundMuted,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          padding: SPACING.sm,
          borderRadius: BORDER_RADIUS.small,
        };
      case 'md':
        return {
          padding: SPACING.md,
          borderRadius: BORDER_RADIUS.medium,
        };
      case 'lg':
        return {
          padding: SPACING.xl,
          borderRadius: BORDER_RADIUS.large,
        };
      default:
        return {};
    }
  };

  return (
    <Box style={[getVariantStyles(), getSizeStyles(), style]} {...boxProps}>
      {children}
    </Box>
  );
};
