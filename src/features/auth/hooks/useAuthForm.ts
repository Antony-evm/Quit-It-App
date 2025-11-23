import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuthWithNavigation } from '@/shared/hooks/useAuthWithNavigation';
import { useAuthMutations } from './useAuthMutations';
import {
  useCustomPasswordValidation,
  useEmailValidation,
  validateName,
  validateConfirmPassword,
} from '@/shared/hooks';
import { validateAndSanitizeEmail } from '@/utils/emailValidation';
import { AUTH_VALIDATION_RULES } from '../constants/validation';
import { AUTH_MESSAGES, AUTH_DEBUG_MESSAGES } from '../constants/messages';

interface UseAuthFormProps {
  initialMode?: 'login' | 'signup';
}

export const useAuthForm = ({ initialMode = 'signup' }: UseAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');

  const { login, signup } = useAuthWithNavigation();
  const { login: loginMutation, signup: signupMutation } = useAuthMutations();

  // Validations with constants
  const passwordValidation = useCustomPasswordValidation(password);
  const emailValidation = useEmailValidation(email);
  const firstNameValidation = validateName(
    firstName,
    AUTH_VALIDATION_RULES.MAX_FIRST_NAME_LENGTH,
  );
  const lastNameValidation = validateName(
    lastName,
    AUTH_VALIDATION_RULES.MAX_LAST_NAME_LENGTH,
  );
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
        password.length >= AUTH_VALIDATION_RULES.MIN_PASSWORD_LENGTH
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
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.EMAIL_REQUIRED);
      return false;
    }

    if (!isEmailValid) {
      Alert.alert(
        AUTH_MESSAGES.INVALID_EMAIL_TITLE,
        AUTH_MESSAGES.EMAIL_INVALID,
      );
      return false;
    }

    if (!password.trim()) {
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.PASSWORD_REQUIRED);
      return false;
    }

    // For signup mode, validate additional fields
    if (!isLoginMode) {
      if (!firstNameValidation.isValid) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          `${AUTH_MESSAGES.FIRST_NAME_ERROR_PREFIX}${firstNameValidation.error}`,
        );
        return false;
      }
      if (!lastNameValidation.isValid) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          `${AUTH_MESSAGES.LAST_NAME_ERROR_PREFIX}${lastNameValidation.error}`,
        );
        return false;
      }
      if (!confirmPasswordValidation.isValid) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          confirmPasswordValidation.error ||
            AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
        );
        return false;
      }
      if (!passwordValidation.isValid) {
        const missingRequirements = passwordValidation.errors.join('\n• ');
        Alert.alert(
          AUTH_MESSAGES.PASSWORD_REQUIREMENTS_NOT_MET,
          `${AUTH_MESSAGES.PASSWORD_REQUIREMENTS_PREFIX}${missingRequirements}`,
        );
        return false;
      }
    } else {
      // For login mode, basic password validation
      if (password.length < AUTH_VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          AUTH_MESSAGES.PASSWORD_TOO_SHORT,
        );
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
      // Use auth with navigation (handles user status routing automatically)
      await login(sanitizedEmail, password);
      // Navigation is handled automatically by useAuthWithNavigation
    } catch (error) {
      console.error(AUTH_DEBUG_MESSAGES.LOGIN_ERROR, error);
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.LOGIN_ERROR);
    }
  }, [validateForm, login, password]);

  const handleSignup = useCallback(async () => {
    const validation = validateForm();
    if (!validation) return;

    const { sanitizedEmail } = validation;

    try {
      // Use auth with navigation (handles user status routing automatically)
      await signup(sanitizedEmail, password, firstName.trim(), lastName.trim());
      // Navigation is handled automatically by useAuthWithNavigation
    } catch (error) {
      console.error(AUTH_DEBUG_MESSAGES.SIGNUP_ERROR, error);
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.SIGNUP_ERROR);
    }
  }, [validateForm, signup, password, firstName, lastName]);

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
    isFormReady,

    // Validation state
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
    handleModeToggle: toggleMode, // Alias for backward compatibility
    toggleMode,
    clearForm,
  };
};
