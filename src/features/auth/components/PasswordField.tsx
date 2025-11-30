import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { AppTextInput, Box, AppIcon, FormField } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_WIDTH } from '@/shared/theme';
import ShowPasswordSvg from '@/assets/showPassword.svg';
import HidePasswordSvg from '@/assets/hidePassword.svg';

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoComplete?: 'current-password' | 'new-password' | 'password';
  errorMessage?: string;
  isLoading?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

export const PasswordField = React.forwardRef<TextInput, PasswordFieldProps>(
  (
    {
      value,
      onChangeText,
      placeholder = 'Password',
      autoComplete = 'password',
      errorMessage,
      isLoading = false,
      onSubmitEditing,
      returnKeyType,
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <FormField errorMessage={errorMessage} showErrorIcon={false}>
        <Box
          flexDirection="row"
          alignItems="center"
          bg="backgroundPrimary"
          borderRadius="medium"
          gap="sm"
          style={[styles.passwordContainer]}
        >
          <AppTextInput
            ref={ref}
            variant="ghost"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!isPasswordVisible}
            autoComplete={autoComplete}
            editable={!isLoading}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={isLoading}
          >
            <AppIcon
              icon={isPasswordVisible ? ShowPasswordSvg : HidePasswordSvg}
            />
          </TouchableOpacity>
        </Box>
      </FormField>
    );
  },
);

const styles = StyleSheet.create({
  passwordContainer: {
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
    paddingRight: SPACING.sm,
    justifyContent: 'space-between',
  },
});
