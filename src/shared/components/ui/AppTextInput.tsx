import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { COLOR_PALETTE, SPACING } from '../../theme';

export type AppTextInputProps = TextInputProps & {
  hasError?: boolean;
};

export const AppTextInput = ({
  style,
  hasError = false,
  ...textInputProps
}: AppTextInputProps) => (
  <TextInput
    style={[styles.input, hasError && styles.inputError, style]}
    placeholderTextColor={COLOR_PALETTE.textMuted}
    {...textInputProps}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLOR_PALETTE.textPrimary,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  inputError: {
    borderColor: COLOR_PALETTE.accentPrimary,
  },
});
