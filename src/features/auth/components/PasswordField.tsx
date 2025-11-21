import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppTextInput, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
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
    <View>
      <View
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
            <ShowPasswordSvg width={24} height={24} fill="none" />
          ) : (
            <HidePasswordSvg width={24} height={24} fill="none" />
          )}
        </TouchableOpacity>
      </View>
      {errorMessage && (
        <AppText variant="caption" style={styles.errorText}>
          {errorMessage}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  passwordContainerError: {
    borderColor: COLOR_PALETTE.accentPrimary,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLOR_PALETTE.textPrimary,
    backgroundColor: 'transparent',
    borderWidth: 0,
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
