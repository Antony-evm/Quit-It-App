import { BootstrapAuthResult } from '@/shared/auth/authBootstrap';
import { UserStatusService } from './userStatusService';
import { USER_STATUS_ACTIONS } from '@/shared/constants/userStatus';
import type { RootStackParamList } from '@/types/navigation';

type StartupRoute = {
  [K in keyof RootStackParamList]: {
    route: K;
    params?: RootStackParamList[K];
  };
}[keyof RootStackParamList];

/**
 * Service for determining startup navigation route based on auth state
 */
export class StartupNavigationService {
  /**
   * Determine the appropriate route based on authentication result
   */
  static determineStartupRoute(authResult: BootstrapAuthResult): StartupRoute {
    // Case 1: No authentication - navigate to signup
    if (!authResult.isAuthenticated) {
      return { route: 'Auth', params: { mode: 'signup' } };
    }

    // Case 2: Tokens exist but are invalid - navigate to login
    if (authResult.isAuthenticated && !authResult.isSessionValid) {
      return { route: 'Auth', params: { mode: 'login' } };
    }

    // Case 3: Valid tokens - navigate based on user status
    if (
      authResult.isAuthenticated &&
      authResult.isSessionValid &&
      authResult.user
    ) {
      return this.determineRouteByUserStatus(authResult.user.userStatusId);
    }

    // Fallback to auth screen
    return { route: 'Auth' };
  }

  /**
   * Determine route based on user status ID
   */
  private static determineRouteByUserStatus(
    userStatusId: number | undefined,
  ): StartupRoute {
    // No user status - go to questionnaire
    if (!userStatusId) {
      return { route: 'Questionnaire' };
    }

    try {
      const action = UserStatusService.getStatusAction(userStatusId);

      if (!action) {
        return { route: 'Questionnaire' };
      }

      // Navigate based on action type
      switch (action.type) {
        case USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE:
          return { route: 'Questionnaire' };

        case USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL:
          return { route: 'Paywall' };

        case USER_STATUS_ACTIONS.NAVIGATE_TO_HOME:
        case USER_STATUS_ACTIONS.PLACEHOLDER_CALL:
          return { route: 'Home' };

        default:
          return { route: 'Questionnaire' };
      }
    } catch (error) {
      console.warn('[StartupNavigationService] Status service error:', error);
      return { route: 'Questionnaire' };
    }
  }
}
