import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import {
  COLOR_PALETTE,
  SPACING,
  TYPOGRAPHY,
  BORDER_WIDTH,
  BORDER_RADIUS,
  DEVICE_HEIGHT,
} from '../../theme';

export type AppTextInputVariant = 'primary' | 'ghost' | 'secondary';

export type AppTextInputProps = TextInputProps & {
  hasError?: boolean;
  variant?: AppTextInputVariant;
};

export const AppTextInput = React.forwardRef<TextInput, AppTextInputProps>(
  (
    { style, hasError = false, variant = 'primary', ...textInputProps },
    ref,
  ) => (
    <TextInput
      ref={ref}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'secondary' && styles.secondary,
        hasError && styles.inputError,
        style,
      ]}
      placeholderTextColor={COLOR_PALETTE.textMuted}
      {...textInputProps}
    />
  ),
);

const styles = StyleSheet.create({
  base: {
    ...TYPOGRAPHY.body,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLOR_PALETTE.textPrimary,
  },
  primary: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  secondary: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    minHeight: DEVICE_HEIGHT * 0.15,
  },
  ghost: {
    borderWidth: BORDER_WIDTH.none,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: COLOR_PALETTE.accentPrimary,
  },
});
