import {
  USER_STATUS_CODES,
  USER_STATUS_ACTIONS,
} from '@/shared/constants/userStatus';
import type { UserStatus, UserStatusAction } from '@/shared/types/userStatus';

// Configuration-driven approach
const STATUS_ACTION_CONFIG: Record<string, UserStatusAction> = {
  [USER_STATUS_CODES.ONBOARDING_INCOMPLETE]: {
    type: USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE,
  },
  [USER_STATUS_CODES.ONBOARDING_COMPLETE]: {
    type: USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL,
  },
  [USER_STATUS_CODES.ONBOARDED_COMPLETE]: {
    type: USER_STATUS_ACTIONS.NAVIGATE_TO_HOME,
  },
  [USER_STATUS_CODES.SUBSCRIBED]: {
    type: USER_STATUS_ACTIONS.NAVIGATE_TO_HOME,
  },
};

/**
 * Get action for a user status using configuration object
 * This eliminates the switch statement and makes it easier to modify
 */
export function getStatusAction(status: UserStatus): UserStatusAction {
  return (
    STATUS_ACTION_CONFIG[status.code] || {
      type: USER_STATUS_ACTIONS.PLACEHOLDER_CALL,
    }
  );
}

/**
 * Add new status action mapping at runtime if needed
 */
export function addStatusActionMapping(
  statusCode: string,
  action: UserStatusAction,
): void {
  STATUS_ACTION_CONFIG[statusCode] = action;
}

/**
 * Get all current status action mappings
 */
export function getStatusActionMappings(): Record<string, UserStatusAction> {
  return { ...STATUS_ACTION_CONFIG };
}
