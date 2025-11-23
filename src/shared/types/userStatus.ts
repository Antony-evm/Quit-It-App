import {
  USER_STATUS_CODES,
  USER_STATUS_ACTIONS,
  UserStatusCode,
  UserStatusActionType,
} from '@/shared/constants/userStatus';

export interface UserStatus {
  id: number;
  code: UserStatusCode;
}

export interface UserStatusesResponse {
  data: {
    statuses: UserStatus[];
  };
}

export type UserStatusAction =
  | { type: typeof USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE }
  | { type: typeof USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL }
  | { type: typeof USER_STATUS_ACTIONS.NAVIGATE_TO_HOME }
  | { type: typeof USER_STATUS_ACTIONS.PLACEHOLDER_CALL };

export interface UserStatusMap {
  [statusId: number]: {
    status: UserStatus;
    action: UserStatusAction;
  };
}
