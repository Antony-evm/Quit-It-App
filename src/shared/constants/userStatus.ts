// User Status Codes
export const USER_STATUS_CODES = {
  ONBOARDING_INCOMPLETE: 'onboarding_incomplete',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  SUBSCRIBED: 'subscribed',
} as const;

// User Status Actions
export const USER_STATUS_ACTIONS = {
  NAVIGATE_TO_QUESTIONNAIRE: 'NAVIGATE_TO_QUESTIONNAIRE',
  NAVIGATE_TO_PAYWALL: 'NAVIGATE_TO_PAYWALL',
  NAVIGATE_TO_HOME: 'NAVIGATE_TO_HOME',
  PLACEHOLDER_CALL: 'PLACEHOLDER_CALL',
} as const;

// Type-safe versions
export type UserStatusCode =
  (typeof USER_STATUS_CODES)[keyof typeof USER_STATUS_CODES];
export type UserStatusActionType =
  (typeof USER_STATUS_ACTIONS)[keyof typeof USER_STATUS_ACTIONS];
