import { NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

// Enhanced UserStatus interface that includes navigation action from backend
export interface EnhancedUserStatus {
  id: number;
  code: string;
  navigation_action: {
    type: 'NAVIGATE' | 'API_CALL' | 'MODAL' | 'EXTERNAL_LINK';
    target: string; // screen name, endpoint, modal name, or URL
    params?: Record<string, any>; // optional parameters
    requires_auth?: boolean;
  };
  display_name: string;
  description?: string;
}

export interface EnhancedUserStatusesResponse {
  data: {
    statuses: EnhancedUserStatus[];
  };
}

export interface EnhancedUserStatusMap {
  [statusId: number]: EnhancedUserStatus;
}

/**
 * Enhanced UserStatusService that gets navigation logic from backend
 * This eliminates hardcoded mappings and makes the system more flexible
 */
export class EnhancedUserStatusService {
  private static statusMap: EnhancedUserStatusMap | null = null;

  /**
   * Initialize the status map by fetching statuses from the backend
   */
  static async initialize(): Promise<void> {
    try {
      // This would be a new endpoint that returns enhanced status information
      // const response: EnhancedUserStatusesResponse = await fetchEnhancedUserStatuses();

      // For now, mock the response to show the concept
      const mockResponse: EnhancedUserStatusesResponse = {
        data: {
          statuses: [
            {
              id: 1,
              code: 'onboarding_incomplete',
              display_name: 'Onboarding Incomplete',
              navigation_action: {
                type: 'NAVIGATE',
                target: 'Questionnaire',
              },
            },
            {
              id: 2,
              code: 'onboarding_complete',
              display_name: 'Onboarding Complete',
              navigation_action: {
                type: 'NAVIGATE',
                target: 'Paywall',
              },
            },
            {
              id: 3,
              code: 'onboarded_complete',
              display_name: 'Onboarded',
              navigation_action: {
                type: 'NAVIGATE',
                target: 'Home',
              },
            },
            {
              id: 4,
              code: 'subscribed',
              display_name: 'Subscribed',
              navigation_action: {
                type: 'NAVIGATE',
                target: 'Home',
              },
            },
          ],
        },
      };

      this.statusMap = this.buildStatusMap(mockResponse.data.statuses);
    } catch (error) {
      console.error(
        'Failed to initialize enhanced user status service:',
        error,
      );
      throw error;
    }
  }

  /**
   * Build the status map
   */
  private static buildStatusMap(
    statuses: EnhancedUserStatus[],
  ): EnhancedUserStatusMap {
    const map: EnhancedUserStatusMap = {};
    statuses.forEach(status => {
      map[status.id] = status;
    });
    return map;
  }

  /**
   * Get status for a given user status ID
   */
  static getStatus(statusId: number): EnhancedUserStatus | null {
    if (!this.statusMap) {
      console.warn(
        'EnhancedUserStatusService not initialized. Call initialize() first.',
      );
      return null;
    }
    return this.statusMap[statusId] || null;
  }

  /**
   * Execute navigation based on user status - completely driven by backend configuration
   */
  static executeStatusAction(
    statusId: number,
    navigation: NativeStackNavigationProp<RootStackParamList>,
  ): void {
    const status = this.getStatus(statusId);

    if (!status) {
      console.error(`Invalid status ID: ${statusId}`);
      return;
    }

    console.log(
      `Executing action for status: ${status.code}`,
      status.navigation_action,
    );

    const { navigation_action } = status;

    switch (navigation_action.type) {
      case 'NAVIGATE':
        // Type-safe navigation to any screen
        if (this.isValidScreenName(navigation_action.target)) {
          navigation.navigate(
            navigation_action.target as any,
            navigation_action.params,
          );
        } else {
          console.error(`Invalid screen name: ${navigation_action.target}`);
        }
        break;

      case 'API_CALL':
        // Execute API call then navigate
        this.executeApiCall(
          navigation_action.target,
          navigation_action.params,
          navigation,
        );
        break;

      case 'MODAL':
        // Show a modal
        this.showModal(navigation_action.target, navigation_action.params);
        break;

      case 'EXTERNAL_LINK':
        // Open external link
        this.openExternalLink(navigation_action.target);
        break;

      default:
        console.warn('Unknown navigation action type:', navigation_action.type);
    }
  }

  /**
   * Validate if screen name exists in navigation
   */
  private static isValidScreenName(screenName: string): boolean {
    const validScreens: (keyof RootStackParamList)[] = [
      'Auth',
      'Questionnaire',
      'Paywall',
      'Home',
    ];
    return validScreens.includes(screenName as keyof RootStackParamList);
  }

  /**
   * Execute API call and handle response
   */
  private static async executeApiCall(
    endpoint: string,
    params: Record<string, any> | undefined,
    navigation: NativeStackNavigationProp<RootStackParamList>,
  ): Promise<void> {
    try {
      // Implementation would depend on your API structure
      console.log(`Executing API call to ${endpoint} with params:`, params);
      // After API call, could navigate based on response
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to execute API call:', error);
    }
  }

  /**
   * Show modal
   */
  private static showModal(
    modalName: string,
    params: Record<string, any> | undefined,
  ): void {
    console.log(`Showing modal: ${modalName} with params:`, params);
    // Implementation would depend on your modal system
  }

  /**
   * Open external link
   */
  private static openExternalLink(url: string): void {
    console.log(`Opening external link: ${url}`);
    // Implementation would use Linking.openURL(url)
  }
}
