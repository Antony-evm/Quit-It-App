import { NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  UserStatus,
  UserStatusMap,
  UserStatusAction,
  UserStatusesResponse,
} from '@/shared/types/userStatus';
import { fetchUserStatuses } from '@/shared/api/userStatusApi';
import { RootStackParamList } from '@/types/navigation';

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export class UserStatusService {
  private static statusMap: UserStatusMap | null = null;

  /**
   * Initialize the status map by fetching statuses from the backend
   */
  static async initialize(): Promise<void> {
    try {
      const response: UserStatusesResponse = await fetchUserStatuses();
      this.statusMap = this.buildStatusMap(response.data.statuses);
    } catch (error) {
      console.error('Failed to initialize user status service:', error);
      throw error;
    }
  }

  /**
   * Build the status map with navigation actions
   */
  private static buildStatusMap(statuses: UserStatus[]): UserStatusMap {
    const map: UserStatusMap = {};

    statuses.forEach(status => {
      let action: UserStatusAction;

      switch (status.code) {
        case 'onboarding_incomplete':
          action = { type: 'NAVIGATE_TO_QUESTIONNAIRE' };
          break;
        case 'onboarded_complete':
          action = { type: 'NAVIGATE_TO_HOME' };
          break;
        case 'subscribed':
          action = { type: 'NAVIGATE_TO_HOME' };
          break;
        default:
          action = { type: 'PLACEHOLDER_CALL' };
          break;
      }

      map[status.id] = {
        status,
        action,
      };
    });

    return map;
  }

  /**
   * Get action for a given user status ID
   */
  static getStatusAction(statusId: number): UserStatusAction | null {
    if (!this.statusMap) {
      console.warn(
        'UserStatusService not initialized. Call initialize() first.',
      );
      return null;
    }

    return this.statusMap[statusId]?.action || null;
  }

  /**
   * Get status details for a given user status ID
   */
  static getStatus(statusId: number): UserStatus | null {
    if (!this.statusMap) {
      console.warn(
        'UserStatusService not initialized. Call initialize() first.',
      );
      return null;
    }

    return this.statusMap[statusId]?.status || null;
  }

  /**
   * Execute navigation based on user status
   */
  static executeStatusAction(
    statusId: number,
    navigation: NativeStackNavigationProp<RootStackParamList>,
  ): void {
    const action = this.getStatusAction(statusId);
    const status = this.getStatus(statusId);

    if (!action || !status) {
      console.error(`Invalid status ID: ${statusId}`);
      return;
    }

    console.log(`Executing action for status: ${status.code}`, action);

    switch (action.type) {
      case 'NAVIGATE_TO_QUESTIONNAIRE':
        // First fetch questionnaire data, then navigate
        this.fetchQuestionnaireDataAndNavigate(navigation);
        break;
      case 'NAVIGATE_TO_HOME':
        // Execute placeholder call, then navigate
        this.executePlaceholderCallAndNavigate(navigation);
        break;
      case 'PLACEHOLDER_CALL':
        this.executePlaceholderCallAndNavigate(navigation);
        break;
      default:
        console.warn('Unknown action type:', action);
    }
  }

  /**
   * Fetch questionnaire data and navigate to questionnaire screen
   */
  private static async fetchQuestionnaireDataAndNavigate(
    navigation: NativeStackNavigationProp<RootStackParamList>,
  ): Promise<void> {
    try {
      // TODO: Implement actual questionnaire data fetching
      // For now, just navigate to the questionnaire screen
      console.log('Fetching questionnaire data from api/v1/questionnaire...');

      // This would be the actual API call:
      // const questionnaireData = await fetchQuestionnaireData();

      navigation.navigate('Questionnaire');
    } catch (error) {
      console.error('Failed to fetch questionnaire data:', error);
      // Handle error - maybe show error screen or navigate to home
      navigation.navigate('Home');
    }
  }

  /**
   * Execute placeholder call and navigate to home
   */
  private static async executePlaceholderCallAndNavigate(
    navigation: NativeStackNavigationProp<RootStackParamList>,
  ): Promise<void> {
    try {
      console.log('Executing placeholder call...');
      // TODO: Implement actual placeholder call

      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to execute placeholder call:', error);
      // Still navigate to home even if placeholder call fails
      navigation.navigate('Home');
    }
  }
}
