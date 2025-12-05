import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStatusAction } from '@/shared/types/userStatus';
import { USER_STATUS_ACTIONS } from '@/shared/constants/userStatus';
import { RootStackParamList } from '@/types/navigation';

/**
 * Handles navigation execution based on user status actions
 */
export class UserStatusNavigator {
  /**
   * Execute navigation based on user status action
   */
  static executeAction(
    action: UserStatusAction,
    navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
  ): void {
    switch (action.type) {
      case USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE:
        navigation.navigate('Questionnaire');
        break;

      case USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL:
        navigation.navigate('Paywall');
        break;

      case USER_STATUS_ACTIONS.NAVIGATE_TO_HOME:
      case USER_STATUS_ACTIONS.PLACEHOLDER_CALL:
        navigation.navigate('Home');
        break;

      default:
        console.warn('[UserStatusNavigator] Unknown action type:', action.type);
        navigation.navigate('Home');
    }
  }
}
