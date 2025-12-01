import { useMemo } from 'react';

export interface PasswordRequirements {
  hasMinLength: boolean;
  hasMaxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export interface CustomPasswordValidation {
  password: string;
  isValid: boolean;
  errors: string[];
  requirements: PasswordRequirements;
}

export const useCustomPasswordValidation = (
  password: string,
): CustomPasswordValidation => {
  return useMemo(() => {
    const errors: string[] = [];
    const requirements: PasswordRequirements = {
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

    return {
      password,
      isValid,
      errors,
      requirements,
    };
  }, [password]);
};
