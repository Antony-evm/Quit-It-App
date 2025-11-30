import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppTextInput, FormField } from '@/shared/components/ui';
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

    useEffect(() => {
      if (validation.isValid && validation.hasInput && !validation.isEmpty) {
        const timer = setTimeout(() => {
          setShowValidHint(false);
        }, 500);

        return () => clearTimeout(timer);
      } else {
        setShowValidHint(true);
      }
    }, [validation.isValid, validation.hasInput, validation.isEmpty]);

    const shouldShowHint = validation.hasInput && !validation.isEmpty;
    const shouldShowValidHint = validation.isValid && showValidHint;
    const shouldShowInvalidHint = !validation.isValid;

    const errorMessage =
      shouldShowHint && shouldShowInvalidHint
        ? 'Invalid email format'
        : undefined;
    const successMessage =
      shouldShowHint && shouldShowValidHint ? 'Valid email' : undefined;

    return (
      <FormField errorMessage={errorMessage} successMessage={successMessage}>
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
      </FormField>
    );
  },
);

const styles = StyleSheet.create({});
