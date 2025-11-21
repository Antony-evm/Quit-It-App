import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/shared/auth';
import { PasswordStrengthIndicator } from '@/shared/components/ui/PasswordStrengthIndicator';
import { usePasswordValidation } from '@/shared/hooks/usePasswordValidation';
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

  // Password validation for signup mode
  const passwordValidation = usePasswordValidation(password);

  const validateForm = useCallback(() => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    // For signup mode, validate additional fields
    if (!isLoginMode) {
      if (!firstName.trim()) {
        Alert.alert('Error', 'Please enter your first name');
        return false;
      }
      if (!lastName.trim()) {
        Alert.alert('Error', 'Please enter your last name');
        return false;
      }
      if (!confirmPassword.trim()) {
        Alert.alert('Error', 'Please confirm your password');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
      if (!passwordValidation.isValid) {
        Alert.alert(
          'Password Too Weak',
          'Password must achieve a zxcvbn strength score of 3 or higher. Please choose a stronger password.',
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
    passwordValidation.isValid,
  ]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email.trim(), password);

      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Questionnaire'),
        },
      ]);
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
      await signup(email.trim(), password, firstName.trim(), lastName.trim());

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Questionnaire'),
        },
      ]);
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

  const submitButtonStyle = useMemo(
    () => [styles.submitButton, isLoading && styles.buttonDisabled],
    [isLoading],
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Quit It</Text>
            <Text style={styles.subtitle}>
              Your journey to quit smoking starts here
            </Text>

            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🚭</Text>
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={loginToggleStyle}
                onPress={handleLoginModePress}
              >
                <Text style={loginToggleTextStyle}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={signupToggleStyle}
                onPress={handleSignupModePress}
              >
                <Text style={signupToggleTextStyle}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* First Name - Only in signup mode */}
              {!isLoginMode && (
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  editable={!isLoading}
                />
              )}

              {/* Last Name - Only in signup mode */}
              {!isLoginMode && (
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoComplete="family-name"
                  editable={!isLoading}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />

              <View style={styles.passwordContainer}>
                <TextInput
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
                  <Text style={styles.passwordToggleText}>
                    {isPasswordVisible ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Confirm Password - Only in signup mode */}
              {!isLoginMode && (
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                    autoComplete="password"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    <Text style={styles.passwordToggleText}>
                      {isConfirmPasswordVisible ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Show password strength indicator only in signup mode */}
              {!isLoginMode && password.length > 0 && (
                <PasswordStrengthIndicator
                  password={password}
                  showDetails={true}
                  style={styles.passwordStrength}
                />
              )}

              <TouchableOpacity
                style={submitButtonStyle}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLoginMode ? 'Login' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              {isLoginMode
                ? "Don't have an account? Tap Sign Up above"
                : 'Already have an account? Tap Login above'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeToggleText: {
    color: 'white',
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordToggle: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordToggleText: {
    fontSize: 18,
  },
  passwordStrength: {
    marginTop: 8,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
    color: '#6c757d',
    lineHeight: 20,
  },
});
