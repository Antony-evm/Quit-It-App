import { useMemo } from 'react';
import { validateAndSanitizeEmail } from '@/utils/emailValidation';

export interface EmailValidationResult {
  sanitizedEmail: string;
  isValid: boolean;
  isEmpty: boolean;
  hasInput: boolean;
}

/**
 * Custom hook for real-time email validation
 * @param email - The email string to validate
 * @returns validation results and sanitized email
 */
export const useEmailValidation = (email: string): EmailValidationResult => {
  const result = useMemo(() => {
    const trimmedEmail = email.trim();
    const isEmpty = trimmedEmail.length === 0;
    const hasInput = email.length > 0;

    if (isEmpty) {
      return {
        sanitizedEmail: '',
        isValid: false,
        isEmpty: true,
        hasInput,
      };
    }

    const { sanitizedEmail, isValid } = validateAndSanitizeEmail(email);

    return {
      sanitizedEmail,
      isValid,
      isEmpty: false,
      hasInput,
    };
  }, [email]);

  return result;
};
