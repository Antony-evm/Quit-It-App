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
  BACKGROUND,
  TEXT,
  SYSTEM,
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
      backgroundColor: BACKGROUND.cream,
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: TEXT.secondary,
  },
  secondary: {
    container: {
      backgroundColor: BACKGROUND.dark,
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: TEXT.primary,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: BORDER_WIDTH.sm,
      borderColor: TEXT.primary,
    },
    textColor: TEXT.primary,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: TEXT.primary,
  },
  danger: {
    container: {
      backgroundColor: SYSTEM.error,
      borderWidth: BORDER_WIDTH.none,
      width: '50%',
    },
    textColor: TEXT.secondary,
  },
  brand: {
    container: {
      backgroundColor: SYSTEM.brand,
      borderWidth: BORDER_WIDTH.none,
    },
    textColor: TEXT.secondary,
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
