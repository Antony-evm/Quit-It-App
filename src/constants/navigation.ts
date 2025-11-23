/**
 * Navigation route constants
 * Centralizes all route names to eliminate magic strings and provide type safety
 */
export const ROUTES = {
  // Auth flow
  AUTH: 'Auth',

  // Onboarding flow
  QUESTIONNAIRE: 'Questionnaire',

  // Main app
  HOME: 'Home',
  PAYWALL: 'Paywall',
} as const;

/**
 * Auth screen modes
 */
export const AUTH_MODES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;

/**
 * Type-safe route keys
 */
export type Route = keyof typeof ROUTES;
export type AuthMode = (typeof AUTH_MODES)[keyof typeof AUTH_MODES];

/**
 * Route values for type checking with RootStackParamList
 */
export type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];
