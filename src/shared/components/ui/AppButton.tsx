import React from 'react';
import {
  PressableProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

import { AppText } from './AppText';
import { AppPressable } from './AppPressable';
import {
  COLOR_PALETTE,
  SPACING,
  BORDER_RADIUS,
  BORDER_WIDTH,
  TypographyVariant,
  OPACITY,
} from '../../theme';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'brand';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
};

const variantToStyles: Record<
  ButtonVariant,
  { container: ViewStyle; textColor: string }
> = {
  primary: {
    container: {
      backgroundColor: COLOR_PALETTE.backgroundCream,
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: COLOR_PALETTE.textSecondary,
  },
  secondary: {
    container: {
      backgroundColor: COLOR_PALETTE.backgroundDark,
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: COLOR_PALETTE.textPrimary,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: BORDER_WIDTH.sm,
      borderColor: COLOR_PALETTE.textPrimary,
    },
    textColor: COLOR_PALETTE.textPrimary,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: COLOR_PALETTE.textPrimary,
  },
  danger: {
    container: {
      backgroundColor: COLOR_PALETTE.systemError,
      borderWidth: BORDER_WIDTH.none,
      width: '50%',
    },
    textColor: COLOR_PALETTE.textSecondary,
  },
  brand: {
    container: {
      backgroundColor: COLOR_PALETTE.brandPrimary,
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: COLOR_PALETTE.textSecondary,
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

const sizeToTextVariant: Record<ButtonSize, TypographyVariant> = {
  xs: 'subcaption',
  sm: 'caption',
  md: 'body',
  lg: 'heading',
};

export const AppButton = ({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  containerStyle,
  textStyle,
  loading = false,
  style,
  ...pressableProps
}: AppButtonProps) => {
  const variantStyles = variantToStyles[variant] ?? variantToStyles.primary;
  const sizeStyles = sizeToStyles[size] ?? sizeToStyles.md;
  const textVariant = sizeToTextVariant[size] ?? 'body';
  const isDisabled = pressableProps.disabled || loading;

  return (
    <AppPressable
      accessibilityRole="button"
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles,
        fullWidth && styles.fullWidth,
        containerStyle,
      ]}
      disabled={isDisabled}
      disabledOpacity={loading ? 1 : OPACITY.medium}
      activeOpacity={OPACITY.medium}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <AppText
          variant={textVariant}
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
      )}
    </AppPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xlarge,
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
