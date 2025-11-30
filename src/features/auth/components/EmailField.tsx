import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppTextInput, FormField } from '@/shared/components/ui';

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
    const { t } = useTranslation();
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
        ? t('auth.invalidEmail')
        : undefined;
    const successMessage =
      shouldShowHint && shouldShowValidHint ? t('auth.validEmail') : undefined;

    return (
      <FormField errorMessage={errorMessage} successMessage={successMessage}>
        <AppTextInput
          ref={ref}
          hasError={validation.hasInput && !validation.isValid}
          placeholder={t('auth.emailPlaceholder')}
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
