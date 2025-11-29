import React, { useRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppTextInput, AppText, Box } from '@/shared/components/ui';
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
    <Box>
      {/* First Name Field */}
      <Box mb="lg">
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
        {firstName.length > 0 && !firstNameValidation.isValid && (
          <AppText variant="caption" style={styles.errorText}>
            {firstNameValidation.error}
          </AppText>
        )}
      </Box>

      {/* Last Name Field */}
      <Box mb="lg">
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
        {lastName.length > 0 && !lastNameValidation.isValid && (
          <AppText variant="caption" style={styles.errorText}>
            {lastNameValidation.error}
          </AppText>
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: COLOR_PALETTE.systemError,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});
