import React, { useRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppTextInput, Box, FormField } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

interface NameValidation {
  isValid: boolean;
  error?: string;
}

interface NameFieldsGroupProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (text: string) => void;
  onLastNameChange: (text: string) => void;
  firstNameValidation: NameValidation;
  lastNameValidation: NameValidation;
  isLoading?: boolean;
}

export const NameFieldsGroup: React.FC<NameFieldsGroupProps> = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  firstNameValidation,
  lastNameValidation,
  isLoading = false,
}) => {
  const lastNameRef = useRef<TextInput>(null);

  return (
    <Box gap="lg">
      {/* First Name Field */}
      <FormField
        errorMessage={
          firstName.length > 0 && !firstNameValidation.isValid
            ? firstNameValidation.error
            : undefined
        }
      >
        <AppTextInput
          placeholder="First name"
          value={firstName}
          onChangeText={onFirstNameChange}
          autoCapitalize="words"
          autoComplete="given-name"
          editable={!isLoading}
          hasError={firstName.length > 0 && !firstNameValidation.isValid}
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />
      </FormField>

      {/* Last Name Field */}
      <FormField
        errorMessage={
          lastName.length > 0 && !lastNameValidation.isValid
            ? lastNameValidation.error
            : undefined
        }
      >
        <AppTextInput
          ref={lastNameRef}
          placeholder="Last name"
          value={lastName}
          onChangeText={onLastNameChange}
          autoCapitalize="words"
          autoComplete="family-name"
          editable={!isLoading}
          hasError={lastName.length > 0 && !lastNameValidation.isValid}
        />
      </FormField>
    </Box>
  );
};
