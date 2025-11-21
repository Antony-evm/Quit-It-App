import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
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
import { COLOR_PALETTE, BRAND_COLORS, SPACING } from '@/shared/theme';
import type { RootStackScreenProps } from '../../../types/navigation';

type AuthScreenProps = RootStackScreenProps<'Auth'>;

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
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
  } = useAuthForm({ navigation });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header with animated logo */}
        <AuthHeader />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Welcome text */}
            <WelcomeText isSignup={!isLoginMode} />

            {/* Mode toggle */}
            <AuthModeToggle
              isLoginMode={isLoginMode}
              onToggle={handleModeToggle}
              isLoading={isLoading}
            />
          </View>

          {/* Cream background section for form and below */}
          <View style={styles.creamSection}>
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

              {/* Show password strength indicator only in signup mode */}
              {!isLoginMode && password.length > 0 && (
                <CustomPasswordStrengthIndicator
                  validation={passwordValidation}
                  showDetails={true}
                  style={styles.passwordStrength}
                />
              )}
            </View>
          </View>
        </ScrollView>

        {/* Submit button */}
        <View style={styles.bottomButtonContainer}>
          <AppButton
            label={isLoginMode ? 'Login' : 'Create Account'}
            variant="secondary"
            size="lg"
            fullWidth
            disabled={isLoading || !isFormReady}
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
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  content: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
  },
  creamSection: {
    backgroundColor: BRAND_COLORS.inkDark,
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
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
    backgroundColor: BRAND_COLORS.cream,
  },
});
