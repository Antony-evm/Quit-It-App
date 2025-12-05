import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  StyleProp,
  TextStyle,
} from 'react-native';

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

export type InputVariant = 'primary' | 'secondary' | 'ghost';

export type AppTextInputProps = TextInputProps & {
  hasError?: boolean;
  variant?: InputVariant;
};

// Constants
const MULTILINE_INPUT_HEIGHT_RATIO = 0.15;

const VARIANT_STYLES: Record<InputVariant, StyleProp<TextStyle>> = {
  primary: { backgroundColor: BACKGROUND.primary },
  secondary: {
    backgroundColor: BACKGROUND.muted,
    minHeight: DEVICE_HEIGHT * MULTILINE_INPUT_HEIGHT_RATIO,
  },
  ghost: { borderWidth: BORDER_WIDTH.none, backgroundColor: 'transparent' },
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
        VARIANT_STYLES[variant],
        hasError && styles.error,
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
  error: {
    borderColor: SYSTEM.accentPrimary,
  },
});
