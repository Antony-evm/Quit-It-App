import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput, AppText } from '@/shared/components/ui';
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
  return (
    <View>
      {/* First Name Field */}
      <View style={styles.fieldContainer}>
        <AppTextInput
          style={styles.input}
          placeholder="First name"
          value={firstName}
          onChangeText={onFirstNameChange}
          autoCapitalize="words"
          autoComplete="given-name"
          editable={!isLoading}
          hasError={firstName.length > 0 && !firstNameValidation.isValid}
        />
        {firstName.length > 0 && !firstNameValidation.isValid && (
          <AppText variant="caption" style={styles.errorText}>
            {firstNameValidation.error}
          </AppText>
        )}
      </View>

      {/* Last Name Field */}
      <View style={styles.fieldContainer}>
        <AppTextInput
          style={styles.input}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  input: {
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLOR_PALETTE.systemError,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});
