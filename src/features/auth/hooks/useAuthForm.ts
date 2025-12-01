import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuthWithNavigation } from '@/shared/hooks/useAuthWithNavigation';
import {
  useCustomPasswordValidation,
  useEmailValidation,
} from '@/shared/hooks';
import { validateAndSanitizeEmail } from '@/utils/emailValidation';
import { validateName, validateConfirmPassword } from '@/utils/validation';
import { AUTH_VALIDATION_RULES } from '../constants/validation';
import { AUTH_MESSAGES } from '../constants/messages';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuthWithNavigation();

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
        emailValidation.isValid &&
        password.length >= AUTH_VALIDATION_RULES.MIN_PASSWORD_LENGTH
      );
    } else {
      return (
        emailValidation.isValid &&
        passwordValidation.isValid &&
        firstNameValidation.isValid &&
        lastNameValidation.isValid &&
        confirmPasswordValidation.isValid
      );
    }
  }, [
    password.length,
    isLoginMode,
    emailValidation.isValid,
    passwordValidation.isValid,
    firstNameValidation.isValid,
    lastNameValidation.isValid,
    confirmPasswordValidation.isValid,
  ]);

  const validateForm = useCallback((): {
    sanitizedEmail: string | null;
    isValid: boolean;
  } => {
    // Validate and sanitize email
    const { sanitizedEmail, isValid: isEmailValid } =
      validateAndSanitizeEmail(email);

    if (!email.trim()) {
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.EMAIL_REQUIRED);
      return { sanitizedEmail: null, isValid: false };
    }

    if (!isEmailValid) {
      Alert.alert(
        AUTH_MESSAGES.INVALID_EMAIL_TITLE,
        AUTH_MESSAGES.EMAIL_INVALID,
      );
      return { sanitizedEmail: null, isValid: false };
    }

    if (!password.trim()) {
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.PASSWORD_REQUIRED);
      return { sanitizedEmail: null, isValid: false };
    }

    // For signup mode, validate additional fields
    if (!isLoginMode) {
      if (!firstNameValidation.isValid) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          `${AUTH_MESSAGES.FIRST_NAME_ERROR_PREFIX}${firstNameValidation.error}`,
        );
        return { sanitizedEmail: null, isValid: false };
      }
      if (!lastNameValidation.isValid) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          `${AUTH_MESSAGES.LAST_NAME_ERROR_PREFIX}${lastNameValidation.error}`,
        );
        return { sanitizedEmail: null, isValid: false };
      }
      if (!confirmPasswordValidation.isValid) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          confirmPasswordValidation.error ||
            AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
        );
        return { sanitizedEmail: null, isValid: false };
      }
      if (!passwordValidation.isValid) {
        const missingRequirements = passwordValidation.errors.join('\n• ');
        Alert.alert(
          AUTH_MESSAGES.PASSWORD_REQUIREMENTS_NOT_MET,
          `${AUTH_MESSAGES.PASSWORD_REQUIREMENTS_PREFIX}${missingRequirements}`,
        );
        return { sanitizedEmail: null, isValid: false };
      }
    } else {
      // For login mode, basic password validation
      if (password.length < AUTH_VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
        Alert.alert(
          AUTH_MESSAGES.ERROR_TITLE,
          AUTH_MESSAGES.PASSWORD_TOO_SHORT,
        );
        return { sanitizedEmail: null, isValid: false };
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
    const { sanitizedEmail, isValid } = validateForm();
    if (!isValid || !sanitizedEmail) return;

    setIsSubmitting(true);
    try {
      // Use auth with navigation (handles user status routing automatically)
      await login(sanitizedEmail, password);
      // Navigation is handled automatically by useAuthWithNavigation
    } catch (error) {
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.LOGIN_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, login, password]);

  const handleSignup = useCallback(async () => {
    const { sanitizedEmail, isValid } = validateForm();
    if (!isValid || !sanitizedEmail) return;

    setIsSubmitting(true);
    try {
      // Use auth with navigation (handles user status routing automatically)
      await signup(sanitizedEmail, password, firstName.trim(), lastName.trim());
      // Navigation is handled automatically by useAuthWithNavigation
    } catch (error) {
      Alert.alert(AUTH_MESSAGES.ERROR_TITLE, AUTH_MESSAGES.SIGNUP_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, signup, password, firstName, lastName]);

  const handleSubmit = useCallback(async () => {
    if (isLoginMode) {
      await handleLogin();
    } else {
      await handleSignup();
    }
  }, [isLoginMode, handleLogin, handleSignup]);

  const toggleMode = useCallback(() => {
    setIsLoginMode(prev => {
      // Clear form when switching modes
      setPassword('');
      setConfirmPassword('');
      if (prev) {
        // Switching to signup mode - keep email but clear names
        setFirstName('');
        setLastName('');
      }
      return !prev;
    });
  }, []);

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

    // Loading state
    isLoading: isSubmitting,

    // Actions
    handleSubmit,
    handleLogin,
    handleSignup,
    handleModeToggle: toggleMode, // Alias for backward compatibility
    toggleMode,
    clearForm,
  };
};
