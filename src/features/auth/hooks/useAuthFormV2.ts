import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/shared/auth';
import { useAuthMutations } from './useAuthMutations';
import {
  useCustomPasswordValidation,
  useEmailValidation,
  validateName,
  validateConfirmPassword,
} from '@/shared/hooks';
import { validateAndSanitizeEmail } from '@/utils/emailValidation';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { UserAuthenticationMethod } from '../types';

interface UseAuthFormProps {
  navigation: NavigationProp<RootStackParamList>;
}

export const useAuthForm = ({ navigation }: UseAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { login, signup } = useAuth();
  const { login: loginMutation, signup: signupMutation } = useAuthMutations();

  // Validations
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
      // For login mode, basic password validation
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }
    }

    return { sanitizedEmail, isValid: true };
  }, [
    email,
    password,
    firstName,
    lastName,
    confirmPassword,
    isLoginMode,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
    confirmPasswordValidation,
  ]);

  const handleLogin = useCallback(async () => {
    const validation = validateForm();
    if (!validation) return;

    const { sanitizedEmail } = validation;

    try {
      // Use the existing auth context login (Stytch integration)
      await login(sanitizedEmail, password);

      // Navigate to next screen after successful authentication
      navigation.navigate('Questionnaire');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    }
  }, [validateForm, login, password, navigation]);

  const handleSignup = useCallback(async () => {
    const validation = validateForm();
    if (!validation) return;

    const { sanitizedEmail } = validation;

    try {
      // Use the existing auth context signup (Stytch integration)
      await signup(sanitizedEmail, password, firstName.trim(), lastName.trim());

      // Navigate directly without success popup
      navigation.navigate('Questionnaire');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        'Error',
        'Failed to create account. Email may already be in use.',
      );
    }
  }, [validateForm, signup, password, firstName, lastName, navigation]);

  const handleSubmit = useCallback(() => {
    if (isLoginMode) {
      handleLogin();
    } else {
      handleSignup();
    }
  }, [isLoginMode, handleLogin, handleSignup]);

  const toggleMode = useCallback(() => {
    setIsLoginMode(!isLoginMode);
    // Clear form when switching modes
    setPassword('');
    setConfirmPassword('');
    if (isLoginMode) {
      // Switching to signup mode - keep email but clear names
      setFirstName('');
      setLastName('');
    }
  }, [isLoginMode]);

  const clearForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  }, []);

  return {
    // Form state
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isLoginMode,

    // Validation state
    isFormReady,
    passwordValidation,
    emailValidation,
    firstNameValidation,
    lastNameValidation,
    confirmPasswordValidation,

    // Loading state from mutations - no more manual state management!
    isLoading: loginMutation.isPending || signupMutation.isPending,

    // Error state from mutations
    error: loginMutation.error || signupMutation.error,

    // Actions
    handleSubmit,
    handleLogin,
    handleSignup,
    toggleMode,
    clearForm,
  };
};
