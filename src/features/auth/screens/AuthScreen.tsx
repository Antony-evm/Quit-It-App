import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ShowPasswordSvg from '@/assets/showPassword.svg';
import HidePasswordSvg from '@/assets/hidePassword.svg';
import { useAuth } from '@/shared/auth';
import {
  CustomPasswordStrengthIndicator,
  AppButton,
  AppText,
  AppTextInput,
  Logo,
} from '@/shared/components/ui';
import {
  useCustomPasswordValidation,
  useEmailValidation,
  validateName,
  validateConfirmPassword,
} from '@/shared/hooks';
import { validateAndSanitizeEmail } from '@/utils/emailValidation';
import { COLOR_PALETTE, BRAND_COLORS, SPACING } from '@/shared/theme';
import type { RootStackScreenProps } from '../../../types/navigation';

type AuthScreenProps = RootStackScreenProps<'Auth'>;

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { login, signup } = useAuth();

  // Custom password validation for signup mode
  const passwordValidation = useCustomPasswordValidation(password);

  // Email validation for real-time feedback
  const emailValidation = useEmailValidation(email);

  // Name validations
  const firstNameValidation = validateName(firstName, 50);
  const lastNameValidation = validateName(lastName, 100);
  const confirmPasswordValidation = validateConfirmPassword(
    password,
    confirmPassword,
  );

  // Check if form is ready for submission
  const isFormReady = useMemo(() => {
    if (isLoginMode) {
      return (
        email.trim() !== '' &&
        password.trim() !== '' &&
        emailValidation.isValid &&
        password.length >= 6
      );
    } else {
      return (
        email.trim() !== '' &&
        password.trim() !== '' &&
        confirmPassword.trim() !== '' &&
        firstName.trim() !== '' &&
        lastName.trim() !== '' &&
        emailValidation.isValid &&
        passwordValidation.isValid &&
        firstNameValidation.isValid &&
        lastNameValidation.isValid &&
        confirmPasswordValidation.isValid
      );
    }
  }, [
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    isLoginMode,
    emailValidation.isValid,
    passwordValidation.isValid,
    firstNameValidation.isValid,
    lastNameValidation.isValid,
    confirmPasswordValidation.isValid,
  ]);

  const validateForm = useCallback(() => {
    // Validate and sanitize email
    const { sanitizedEmail, isValid: isEmailValid } =
      validateAndSanitizeEmail(email);

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!isEmailValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    // For signup mode, validate additional fields
    if (!isLoginMode) {
      if (!firstNameValidation.isValid) {
        Alert.alert('Error', `First name: ${firstNameValidation.error}`);
        return false;
      }
      if (!lastNameValidation.isValid) {
        Alert.alert('Error', `Last name: ${lastNameValidation.error}`);
        return false;
      }
      if (!confirmPasswordValidation.isValid) {
        Alert.alert(
          'Error',
          confirmPasswordValidation.error || 'Please confirm your password',
        );
        return false;
      }
      if (!passwordValidation.isValid) {
        const missingRequirements = passwordValidation.errors.join('\n• ');
        Alert.alert(
          'Password Requirements Not Met',
          `Your password must include:\n\n• ${missingRequirements}`,
        );
        return false;
      }
    } else {
      // For login mode, just require minimum length
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return false;
      }
    }

    return true;
  }, [
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    isLoginMode,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
    confirmPasswordValidation,
  ]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { sanitizedEmail } = validateAndSanitizeEmail(email);
      await login(sanitizedEmail, password);

      // Navigate directly without success popup
      navigation.navigate('Questionnaire');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, login, email, password, navigation]);

  const handleSignup = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { sanitizedEmail } = validateAndSanitizeEmail(email);
      await signup(sanitizedEmail, password, firstName.trim(), lastName.trim());

      // Navigate directly without success popup
      navigation.navigate('Questionnaire');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        'Error',
        'Failed to create account. Email may already be in use.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, signup, email, password, firstName, lastName, navigation]);

  const handleSubmit = useCallback(() => {
    if (isLoginMode) {
      handleLogin();
    } else {
      handleSignup();
    }
  }, [isLoginMode, handleLogin, handleSignup]);

  const handleLoginModePress = useCallback(() => {
    setIsLoginMode(true);
    // Clear signup-specific fields when switching to login
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  }, []);

  const handleSignupModePress = useCallback(() => {
    setIsLoginMode(false);
  }, []);

  // Memoize style arrays to prevent recreating them on every render
  const loginToggleStyle = useMemo(
    () => [styles.toggleButton, isLoginMode && styles.activeToggle],
    [isLoginMode],
  );

  const signupToggleStyle = useMemo(
    () => [styles.toggleButton, !isLoginMode && styles.activeToggle],
    [isLoginMode],
  );

  const loginToggleTextStyle = useMemo(
    () => [styles.toggleText, isLoginMode && styles.activeToggleText],
    [isLoginMode],
  );

  const signupToggleTextStyle = useMemo(
    () => [styles.toggleText, !isLoginMode && styles.activeToggleText],
    [isLoginMode],
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <AppText variant="title" tone="inverse" style={styles.title}>
              Welcome to Quit It
            </AppText>
            <AppText variant="body" tone="inverse" style={styles.subtitle}>
              Your journey to quit smoking starts here
            </AppText>

            <View style={styles.logoContainer}>
              <Logo size="large" />
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={loginToggleStyle}
                onPress={handleLoginModePress}
              >
                <AppText variant="body" style={loginToggleTextStyle}>
                  Login
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={signupToggleStyle}
                onPress={handleSignupModePress}
              >
                <AppText variant="body" style={signupToggleTextStyle}>
                  Sign Up
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* First Name - Only in signup mode */}
              {!isLoginMode && (
                <View style={styles.fieldContainer}>
                  <AppTextInput
                    style={styles.input}
                    placeholder="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    editable={!isLoading}
                    hasError={
                      firstName.length > 0 && !firstNameValidation.isValid
                    }
                  />
                  {firstName.length > 0 && !firstNameValidation.isValid && (
                    <AppText variant="caption" style={styles.errorText}>
                      {firstNameValidation.error}
                    </AppText>
                  )}
                </View>
              )}

              {/* Last Name - Only in signup mode */}
              {!isLoginMode && (
                <View style={styles.fieldContainer}>
                  <AppTextInput
                    style={styles.input}
                    placeholder="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    editable={!isLoading}
                    hasError={
                      lastName.length > 0 && !lastNameValidation.isValid
                    }
                  />
                  {lastName.length > 0 && !lastNameValidation.isValid && (
                    <AppText variant="caption" style={styles.errorText}>
                      {lastNameValidation.error}
                    </AppText>
                  )}
                </View>
              )}

              <View style={styles.emailContainer}>
                <AppTextInput
                  hasError={
                    emailValidation.hasInput && !emailValidation.isValid
                  }
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
                {emailValidation.hasInput && !emailValidation.isEmpty && (
                  <AppText
                    variant="body"
                    style={[
                      styles.emailValidationText,
                      emailValidation.isValid
                        ? styles.emailValidText
                        : styles.emailInvalidText,
                    ]}
                  >
                    {emailValidation.isValid
                      ? '✓ Valid email'
                      : '✗ Invalid email format'}
                  </AppText>
                )}
              </View>

              <View style={styles.passwordContainer}>
                <AppTextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <ShowPasswordSvg width={24} height={24} />
                  ) : (
                    <HidePasswordSvg width={24} height={24} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Confirm Password - Only in signup mode */}
              {!isLoginMode && (
                <View style={styles.passwordContainer}>
                  <AppTextInput
                    style={styles.passwordInput}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                    autoComplete="password"
                    editable={!isLoading}
                    hasError={
                      confirmPassword.length > 0 &&
                      !confirmPasswordValidation.isValid
                    }
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <ShowPasswordSvg width={24} height={24} />
                    ) : (
                      <HidePasswordSvg width={24} height={24} />
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Confirm password error */}
              {!isLoginMode &&
                confirmPassword.length > 0 &&
                !confirmPasswordValidation.isValid && (
                  <AppText variant="caption" style={styles.errorText}>
                    {confirmPasswordValidation.error}
                  </AppText>
                )}

              {/* Show password strength indicator only in signup mode */}
              {!isLoginMode && password.length > 0 && (
                <CustomPasswordStrengthIndicator
                  validation={passwordValidation}
                  showDetails={true}
                  style={styles.passwordStrength}
                />
              )}

              <AppButton
                label={isLoginMode ? 'Login' : 'Create Account'}
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading || !isFormReady}
                onPress={handleSubmit}
                containerStyle={styles.submitButton}
              />
            </View>

            <AppText variant="body" tone="inverse" style={styles.footerText}>
              {isLoginMode
                ? "Don't have an account? Tap Sign Up above"
                : 'Already have an account? Tap Login above'}
            </AppText>
          </View>
        </ScrollView>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
  },
  logoContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.accentMuted,
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: BRAND_COLORS.cream,
  },
  toggleText: {
    fontSize: 16,
    color: COLOR_PALETTE.textMuted,
    fontWeight: '500',
  },
  activeToggleText: {
    color: BRAND_COLORS.ink,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLOR_PALETTE.systemError,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 12,
    marginBottom: SPACING.lg,
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
  passwordStrength: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: SPACING.xl,
    lineHeight: 20,
  },
  emailContainer: {
    marginBottom: SPACING.lg,
  },
  emailValidationText: {
    fontSize: 12,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  emailValidText: {
    color: BRAND_COLORS.cream,
  },
  emailInvalidText: {
    color: COLOR_PALETTE.systemError,
  },
});
