import { useState, useEffect } from 'react';

export interface CustomPasswordValidation {
  password: string;
  isValid: boolean;
  errors: string[];
  requirements: {
    hasMinLength: boolean;
    hasMaxLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

export const useCustomPasswordValidation = (
  password: string,
): CustomPasswordValidation => {
  const [validation, setValidation] = useState<CustomPasswordValidation>({
    password: '',
    isValid: false,
    errors: [],
    requirements: {
      hasMinLength: false,
      hasMaxLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSymbol: false,
    },
  });

  useEffect(() => {
    const errors: string[] = [];
    const requirements = {
      hasMinLength: password.length >= 8,
      hasMaxLength: password.length <= 32,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (!requirements.hasMinLength) {
      errors.push('At least 8 characters');
    }
    if (!requirements.hasMaxLength) {
      errors.push('No more than 32 characters');
    }
    if (!requirements.hasUppercase) {
      errors.push('At least one uppercase letter');
    }
    if (!requirements.hasLowercase) {
      errors.push('At least one lowercase letter');
    }
    if (!requirements.hasNumber) {
      errors.push('At least one number');
    }
    if (!requirements.hasSymbol) {
      errors.push('At least one special character');
    }

    const isValid = Object.values(requirements).every(Boolean);

    setValidation({
      password,
      isValid,
      errors,
      requirements,
    });
  }, [password]);

  return validation;
};

// Helper function for name validation
export const validateName = (
  name: string,
  maxLength: number,
): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'This field is required' };
  }

  if (name.length > maxLength) {
    return { isValid: false, error: `Must be ${maxLength} characters or less` };
  }

  if (/\d/.test(name)) {
    return { isValid: false, error: 'Numbers are not allowed' };
  }

  return { isValid: true };
};

// Helper function for confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};
