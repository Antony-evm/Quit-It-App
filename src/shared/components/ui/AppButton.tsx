import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { AppText } from './AppText';
import {
  BRAND_COLORS,
  COLOR_PALETTE,
  SPACING,
  BORDER_RADIUS,
} from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const variantToStyles: Record<
  ButtonVariant,
  { container: ViewStyle; textColor: string }
> = {
  primary: {
    container: {
      backgroundColor: COLOR_PALETTE.backgroundCream, // CREAM
      borderWidth: 0,
    },
    textColor: COLOR_PALETTE.textSecondary, // BRAND INK
  },
  secondary: {
    container: {
      backgroundColor: COLOR_PALETTE.backgroundMuted,
      borderWidth: 0,
    },
    textColor: COLOR_PALETTE.textPrimary,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: BRAND_COLORS.cream,
    },
    textColor: COLOR_PALETTE.textPrimary,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    textColor: COLOR_PALETTE.textPrimary,
  },
};

const sizeToStyles: Record<ButtonSize, ViewStyle> = {
  xs: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  sm: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  lg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
};

export const AppButton = ({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  containerStyle,
  textStyle,
  ...pressableProps
}: AppButtonProps) => {
  const variantStyles = variantToStyles[variant] ?? variantToStyles.primary;
  const sizeStyles = sizeToStyles[size] ?? sizeToStyles.md;
  const isDisabled = pressableProps.disabled ?? false;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        sizeStyles,
        fullWidth && styles.fullWidth,
        {
          opacity: isDisabled || pressed ? 0.7 : 1,
        },
        containerStyle,
      ]}
      {...pressableProps}
    >
      <AppText
        variant="heading"
        style={[
          styles.text,
          {
            color: variantStyles.textColor,
          },
          textStyle,
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});
