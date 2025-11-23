/**
 * Authentication error and user-facing messages
 * Centralizes all text to eliminate magic strings and enable easy localization
 */
export const AUTH_MESSAGES = {
  // Email validation messages
  EMAIL_REQUIRED: 'Please enter your email address',
  EMAIL_INVALID: 'Please enter a valid email address',

  // Password validation messages
  PASSWORD_REQUIRED: 'Please enter your password',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  PASSWORD_REQUIREMENTS_NOT_MET: 'Password Requirements Not Met',
  PASSWORD_REQUIREMENTS_PREFIX: 'Your password must include:\n\n• ',

  // Name validation messages
  FIRST_NAME_ERROR_PREFIX: 'First name: ',
  LAST_NAME_ERROR_PREFIX: 'Last name: ',

  // Confirm password messages
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',

  // Authentication error messages
  LOGIN_ERROR: 'Invalid email or password. Please try again.',
  SIGNUP_ERROR: 'Failed to create account. Email may already be in use.',

  // Alert titles
  ERROR_TITLE: 'Error',
  INVALID_EMAIL_TITLE: 'Invalid Email',
} as const;

/**
 * Console log messages for debugging
 */
export const AUTH_DEBUG_MESSAGES = {
  LOGIN_ERROR: 'Login error:',
  SIGNUP_ERROR: 'Signup error:',
} as const;

/**
 * Type-safe message keys
 */
export type AuthMessage = keyof typeof AUTH_MESSAGES;
export type AuthDebugMessage = keyof typeof AUTH_DEBUG_MESSAGES;
