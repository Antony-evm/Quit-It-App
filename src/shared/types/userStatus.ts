export interface UserStatus {
  id: number;
  code: 'onboarding_incomplete' | 'onboarded_complete' | 'subscribed';
}

export interface UserStatusesResponse {
  data: {
    statuses: UserStatus[];
  };
}

export type UserStatusAction =
  | { type: 'NAVIGATE_TO_QUESTIONNAIRE' }
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'PLACEHOLDER_CALL' };

export interface UserStatusMap {
  [statusId: number]: {
    status: UserStatus;
    action: UserStatusAction;
  };
}
