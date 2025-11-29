import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AppTextInput, AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';
import ShowPasswordSvg from '@/assets/showPassword.svg';
import HidePasswordSvg from '@/assets/hidePassword.svg';

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoComplete?: 'current-password' | 'new-password' | 'password';
  hasError?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChangeText,
  placeholder = 'Password',
  autoComplete = 'password',
  hasError = false,
  errorMessage,
  isLoading = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Box>
      <Box
        flexDirection="row"
        alignItems="center"
        bg="backgroundPrimary"
        borderRadius="medium"
        mb="lg"
        style={[
          styles.passwordContainer,
          hasError && styles.passwordContainerError,
        ]}
      >
        <AppTextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isPasswordVisible}
          autoComplete={autoComplete}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          disabled={isLoading}
        >
          {isPasswordVisible ? (
            <ShowPasswordSvg width={20} height={20} fill="none" />
          ) : (
            <HidePasswordSvg width={20} height={20} fill="none" />
          )}
        </TouchableOpacity>
      </Box>
      {errorMessage && (
        <AppText variant="caption" style={styles.errorText}>
          {errorMessage}
        </AppText>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  passwordContainerError: {
    borderColor: COLOR_PALETTE.accentPrimary,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLOR_PALETTE.textPrimary,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 0,
  },
  passwordToggle: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLOR_PALETTE.systemError,
    marginTop: -SPACING.lg + SPACING.xs,
    marginBottom: SPACING.lg,
    marginLeft: SPACING.sm,
  },
});
