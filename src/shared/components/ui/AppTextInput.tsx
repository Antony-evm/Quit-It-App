import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import {
  BACKGROUND,
  TEXT,
  SYSTEM,
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
      placeholderTextColor={TEXT.muted}
      {...textInputProps}
    />
  ),
);

const styles = StyleSheet.create({
  base: {
    ...TYPOGRAPHY.body,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: TEXT.primary,
  },
  primary: {
    backgroundColor: BACKGROUND.primary,
  },
  secondary: {
    backgroundColor: BACKGROUND.muted,
    minHeight: DEVICE_HEIGHT * 0.15,
  },
  ghost: {
    borderWidth: BORDER_WIDTH.none,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: SYSTEM.accentPrimary,
  },
});
