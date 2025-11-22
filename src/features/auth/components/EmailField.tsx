import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, BRAND_COLORS, SPACING } from '@/shared/theme';

interface EmailValidation {
  hasInput: boolean;
  isEmpty: boolean;
  isValid: boolean;
}

interface EmailFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  validation: EmailValidation;
  isLoading?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChangeText,
  validation,
  isLoading = false,
}) => {
  return (
    <View>
      <AppTextInput
        hasError={validation.hasInput && !validation.isValid}
        placeholder="Email address"
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!isLoading}
      />
      {validation.hasInput && !validation.isEmpty && (
        <AppText
          variant="body"
          style={[
            styles.emailValidationText,
            validation.isValid
              ? styles.emailValidText
              : styles.emailInvalidText,
          ]}
        >
          {validation.isValid ? '✓ Valid email' : '✗ Invalid email format'}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emailValidationText: {
    fontSize: 12,
    marginTop: -SPACING.lg + SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '500',
    marginBottom: SPACING.lg,
  },
  emailValidText: {
    color: '#059669',
  },
  emailInvalidText: {
    color: COLOR_PALETTE.systemError,
  },
});
