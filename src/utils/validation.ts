/**
 * Generic validation utility functions
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a name field (first name, last name, etc.)
 * @param name - The name string to validate
 * @param maxLength - Maximum allowed length
 * @returns Validation result with optional error message
 */
export const validateName = (
  name: string,
  maxLength: number,
): ValidationResult => {
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

/**
 * Validates that confirm password matches the original password
 * @param password - The original password
 * @param confirmPassword - The confirmation password to match
 * @returns Validation result with optional error message
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};
