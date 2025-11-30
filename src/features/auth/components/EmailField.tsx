import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
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
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

export const EmailField = React.forwardRef<TextInput, EmailFieldProps>(
  (
    {
      value,
      onChangeText,
      validation,
      isLoading = false,
      onSubmitEditing,
      returnKeyType,
    },
    ref,
  ) => {
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
      <Box mb="lg" gap="xs">
        <AppTextInput
          ref={ref}
          hasError={validation.hasInput && !validation.isValid}
          placeholder="Email address"
          value={value}
          onChangeText={onChangeText}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
        />
        {shouldShowHint && (shouldShowValidHint || shouldShowInvalidHint) && (
          <AppText
            variant="subcaption"
            tone={validation.isValid ? 'success' : 'error'}
          >
            {validation.isValid ? '✓ Valid email' : '✗ Invalid email format'}
          </AppText>
        )}
      </Box>
    );
  },
);

const styles = StyleSheet.create({});
