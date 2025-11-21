import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/shared/auth';
import {
  useCustomPasswordValidation,
  useEmailValidation,
  validateName,
  validateConfirmPassword,
} from '@/shared/hooks';
import { validateAndSanitizeEmail } from '@/utils/emailValidation';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';

interface UseAuthFormProps {
  navigation: NavigationProp<RootStackParamList>;
}

export const useAuthForm = ({ navigation }: UseAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { login, signup } = useAuth();

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

  const handleModeToggle = useCallback(() => {
    setIsLoginMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        // Switching to login mode - clear signup-specific fields
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
      }
      return newMode;
    });
  }, []);

  return {
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
  };
};
