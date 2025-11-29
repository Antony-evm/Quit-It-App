import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CustomPasswordStrengthIndicator,
  AppButton,
  AppText,
} from '@/shared/components/ui';
import { AuthHeader } from '../components/AuthHeader';
import { AuthModeToggle } from '../components/AuthModeToggle';
import { PasswordField } from '../components/PasswordField';
import { EmailField } from '../components/EmailField';
import { NameFieldsGroup } from '../components/NameFieldsGroup';
import { WelcomeText } from '../components/WelcomeText';
import { useAuthForm } from '../hooks/useAuthForm';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import type { RootStackScreenProps } from '../../../types/navigation';

type AuthScreenProps = RootStackScreenProps<'Auth'>;

export const AuthScreen: React.FC<AuthScreenProps> = ({
  navigation,
  route,
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Get initial mode from route params, default to signup if no tokens, login if invalid tokens
  const initialMode = route.params?.mode || 'signup';

  const {
    // Form state
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    isLoading,
    isLoginMode,
    isFormReady,

    // Form handlers
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    handleSubmit,
    handleModeToggle,

    // Validations
    emailValidation,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
    confirmPasswordValidation,
  } = useAuthForm({ initialMode });

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header with animated logo */}
        <AuthHeader />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <WelcomeText isSignup={!isLoginMode} />

          <View style={styles.inkDarkContainer}>
            {/* Auth form */}
            <View style={styles.formContainer}>
              {/* Name fields - Only in signup mode */}
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

              {/* Email field */}
              <EmailField
                value={email}
                onChangeText={setEmail}
                validation={emailValidation}
                isLoading={isLoading}
              />

              {/* Password field */}
              <PasswordField
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                isLoading={isLoading}
              />

              {/* Confirm Password - Only in signup mode */}
              {!isLoginMode && (
                <PasswordField
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  hasError={
                    confirmPassword.length > 0 &&
                    !confirmPasswordValidation.isValid
                  }
                  errorMessage={
                    confirmPassword.length > 0 &&
                    !confirmPasswordValidation.isValid
                      ? confirmPasswordValidation.error
                      : undefined
                  }
                  isLoading={isLoading}
                />
              )}

              {/* Show password strength indicator always in signup mode */}
              {!isLoginMode && (
                <CustomPasswordStrengthIndicator
                  validation={passwordValidation}
                  style={styles.passwordStrength}
                />
              )}
            </View>

            {/* Mode toggle */}
            <AuthModeToggle
              isLoginMode={isLoginMode}
              onToggle={handleModeToggle}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>

        {/* Submit button - back at the bottom but with stable positioning */}
        <View
          style={[
            styles.bottomButtonContainer,
            isKeyboardVisible && styles.bottomButtonContainerKeyboardVisible,
          ]}
        >
          <AppButton
            label={isLoginMode ? 'Login' : 'Create Account'}
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!isFormReady}
            onPress={handleSubmit}
          />
        </View>
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
  inkDarkContainer: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  passwordStrength: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  bottomButtonContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxl,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  bottomButtonContainerKeyboardVisible: {
    paddingVertical: SPACING.sm, // Smaller padding when keyboard is visible for stability
  },
});
