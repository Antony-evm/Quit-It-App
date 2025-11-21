/**
 * Email validation utility functions
 */

/**
 * Validates email format using a comprehensive regex pattern
 * @param email - The email string to validate
 * @returns true if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;

  // RFC 5322 compliant email regex (simplified but comprehensive)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
};

/**
 * Sanitizes email by trimming whitespace and converting to lowercase
 * @param email - The email string to sanitize
 * @returns sanitized email string
 */
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Validates and sanitizes email in one step
 * @param email - The email string to process
 * @returns object with sanitized email and validation status
 */
export const validateAndSanitizeEmail = (
  email: string,
): {
  sanitizedEmail: string;
  isValid: boolean;
} => {
  const sanitizedEmail = sanitizeEmail(email);
  const isValid = isValidEmail(sanitizedEmail);

  return {
    sanitizedEmail,
    isValid,
  };
};
