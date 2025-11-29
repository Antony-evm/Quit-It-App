import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import {
  COLOR_PALETTE,
  SPACING,
  TYPOGRAPHY,
  BORDER_WIDTH,
  BORDER_RADIUS,
} from '../../theme';

export type AppTextInputVariant = 'primary' | 'ghost';

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
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLOR_PALETTE.textPrimary,
  },
  primary: {
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  ghost: {
    borderWidth: BORDER_WIDTH.none,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: COLOR_PALETTE.accentPrimary,
  },
});
