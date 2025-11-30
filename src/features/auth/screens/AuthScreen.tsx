import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Box } from '@/shared/components/ui';
import { AuthHeader } from '../components/AuthHeader';
import { AuthModeToggle } from '../components/AuthModeToggle';
import { PasswordField } from '../components/PasswordField';
import { EmailField } from '../components/EmailField';
import { NameFieldsGroup } from '../components/NameFieldsGroup';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';
import { WelcomeText } from '../components/WelcomeText';
import { useAuthForm } from '../hooks/useAuthForm';
import { useKeyboardVisibility } from '@/shared/hooks/useKeyboardVisibility';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import type { RootStackScreenProps } from '../../../types/navigation';

type AuthScreenProps = RootStackScreenProps<'Auth'>;

export const AuthScreen: React.FC<AuthScreenProps> = ({ route }) => {
  const isKeyboardVisible = useKeyboardVisibility();

  const initialMode = route.params?.mode || 'signup';

  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    isLoading,
    isLoginMode,
    isFormReady,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    handleSubmit,
    handleModeToggle,
    emailValidation,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
    confirmPasswordValidation,
  } = useAuthForm({ initialMode });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <AuthHeader />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <WelcomeText isSignup={!isLoginMode} />

          <Box bg="backgroundMuted" px="xxl" py="xl" flex={1} gap="lg">
            <Box style={{ width: '100%' }} gap="lg">
              {!isLoginMode && (
                <NameFieldsGroup
                  firstName={firstName}
                  lastName={lastName}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                  firstNameValidation={firstNameValidation}
                  lastNameValidation={lastNameValidation}
                  isLoading={isLoading}
                />
              )}

              <EmailField
                value={email}
                onChangeText={setEmail}
                validation={emailValidation}
                isLoading={isLoading}
              />

              <PasswordField
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                isLoading={isLoading}
              />

              {!isLoginMode && (
                <PasswordField
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  errorMessage={
                    confirmPassword.length > 0 &&
                    !confirmPasswordValidation.isValid
                      ? confirmPasswordValidation.error
                      : undefined
                  }
                  isLoading={isLoading}
                />
              )}

              {!isLoginMode && (
                <PasswordStrengthIndicator validation={passwordValidation} />
              )}
            </Box>

            <AuthModeToggle
              isLoginMode={isLoginMode}
              onToggle={handleModeToggle}
              isLoading={isLoading}
            />
          </Box>
        </ScrollView>

        <Box px="xxl" py={isKeyboardVisible ? 'sm' : 'md'} bg="backgroundMuted">
          <AppButton
            label={isLoginMode ? 'Login' : 'Create Account'}
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={!isFormReady}
            onPress={handleSubmit}
          />
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.lg,
  },
});
