import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AppTextInput, AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

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
  const [showValidHint, setShowValidHint] = useState(true);

  // Effect to hide valid email hint after 500ms
  useEffect(() => {
    if (validation.isValid && validation.hasInput && !validation.isEmpty) {
      const timer = setTimeout(() => {
        setShowValidHint(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // Reset to show hint when email becomes invalid or empty
      setShowValidHint(true);
    }
  }, [validation.isValid, validation.hasInput, validation.isEmpty]);

  const shouldShowHint = validation.hasInput && !validation.isEmpty;
  const shouldShowValidHint = validation.isValid && showValidHint;
  const shouldShowInvalidHint = !validation.isValid;

  return (
    <Box mb="lg">
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
      {shouldShowHint && (shouldShowValidHint || shouldShowInvalidHint) && (
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
    </Box>
  );
};

const styles = StyleSheet.create({
  emailValidationText: {
    fontSize: 12,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  emailValidText: {
    color: COLOR_PALETTE.systemSuccess,
  },
  emailInvalidText: {
    color: COLOR_PALETTE.systemError,
  },
});
