/**
 * Authentication validation constants
 * Centralizes all validation rules to eliminate magic numbers
 */
export const AUTH_VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_FIRST_NAME_LENGTH: 50,
  MAX_LAST_NAME_LENGTH: 100,
} as const;

/**
 * Form field validation rules
 */
export const FORM_VALIDATION = {
  EMAIL_REQUIRED: true,
  PASSWORD_REQUIRED: true,
  FIRST_NAME_REQUIRED_FOR_SIGNUP: true,
  LAST_NAME_REQUIRED_FOR_SIGNUP: true,
  CONFIRM_PASSWORD_REQUIRED_FOR_SIGNUP: true,
} as const;

/**
 * Type-safe validation rule keys
 */
export type AuthValidationRule = keyof typeof AUTH_VALIDATION_RULES;
