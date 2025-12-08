import React, { useRef } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
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
import { BACKGROUND } from '@/shared/theme';
import type { RootStackScreenProps } from '../../../types/navigation';

type AuthScreenProps = RootStackScreenProps<'Auth'>;

export const AuthScreen: React.FC<AuthScreenProps> = ({ route }) => {
  const initialMode = route.params?.mode || 'signup';

  // Refs for keyboard navigation
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <WelcomeText isSignup={!isLoginMode} />

          <Box bg="muted" px="xxl" py="xl" flex={1} gap="lg">
            <Box gap="lg">
              {!isLoginMode && (
                <NameFieldsGroup
                  firstName={firstName}
                  lastName={lastName}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                  firstNameValidation={firstNameValidation}
                  lastNameValidation={lastNameValidation}
                  isLoading={isLoading}
                  onLastNameSubmit={() => emailRef.current?.focus()}
                />
              )}

              <EmailField
                ref={emailRef}
                value={email}
                onChangeText={setEmail}
                validation={emailValidation}
                isLoading={isLoading}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <PasswordField
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                isLoading={isLoading}
                returnKeyType={isLoginMode ? 'done' : 'next'}
                onSubmitEditing={() => {
                  if (isLoginMode) {
                    handleSubmit();
                  } else {
                    confirmPasswordRef.current?.focus();
                  }
                }}
              />

              {!isLoginMode && (
                <PasswordField
                  ref={confirmPasswordRef}
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
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
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

        <Box px="xxl" py="md" bg="muted">
          <AppButton
            label={isLoginMode ? 'Login' : 'Create Account'}
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
    backgroundColor: BACKGROUND.muted,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: BACKGROUND.muted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
