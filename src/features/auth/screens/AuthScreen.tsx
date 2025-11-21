import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const { login, signup } = useAuth();

  const appName = 'QUIT IT';
  useEffect(() => {
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= appName.length) {
          setDisplayedText(appName.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, 150);

      return () => clearInterval(typingInterval);
    }, 500);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearTimeout(startDelay);
      clearInterval(cursorInterval);
    };
  }, []);

  const passwordValidation = useCustomPasswordValidation(password);
  const emailValidation = useEmailValidation(email);
  const firstNameValidation = validateName(firstName, 50);
  const lastNameValidation = validateName(lastName, 100);
  const confirmPasswordValidation = validateConfirmPassword(
    password,
    confirmPassword,
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Logo at top 10% of screen */}
        <View style={styles.logoSection}>
          <AppText variant="heading" tone="inverse" style={styles.appName}>
            {displayedText}
          </AppText>
          <Logo size="large" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Placeholder text below logo */}
            <AppText variant="title" tone="inverse" style={styles.title}>
              Welcome to Quit It
            </AppText>
            <AppText variant="body" tone="inverse" style={styles.subtitle}>
              Your journey to quit smoking starts here
            </AppText>

            {/* Mode toggle text */}
            <TouchableOpacity
              style={styles.modeToggle}
              onPress={
                isLoginMode ? handleSignupModePress : handleLoginModePress
              }
              activeOpacity={0.7}
            >
              <AppText
                variant="body"
                tone="inverse"
                style={styles.modeToggleText}
              >
                {isLoginMode
                  ? "Don't have an account? Tap here to sign up"
                  : 'Already have an account? Tap here to login'}
              </AppText>
            </TouchableOpacity>

            {/* Auth form */}
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
                    <ShowPasswordSvg width={24} height={24} fill="none" />
                  ) : (
                    <HidePasswordSvg width={24} height={24} fill="none" />
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
                      <ShowPasswordSvg width={24} height={24} fill="none" />
                    ) : (
                      <HidePasswordSvg width={24} height={24} fill="none" />
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
            </View>
          </View>
        </ScrollView>

        {/* Button at bottom of screen */}
        <View style={styles.bottomButtonContainer}>
          <AppButton
            label={isLoginMode ? 'Login' : 'Create Account'}
            variant="primary"
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
  logoSection: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: BRAND_COLORS.cream,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  content: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
    color: BRAND_COLORS.cream, // Explicit color for better visibility
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    color: BRAND_COLORS.cream, // Explicit color for better visibility
    opacity: 0.9,
  },
  modeToggle: {
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(249, 246, 242, 0.05)', // Subtle background to show touchable area
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(249, 246, 242, 0.1)',
  },
  modeToggleText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '500',
    color: BRAND_COLORS.cream, // Explicitly set color for better visibility
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLOR_PALETTE.systemError,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  input: {
    marginBottom: SPACING.lg,
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
  bottomButtonContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
});
