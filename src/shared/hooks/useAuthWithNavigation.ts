import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';
import type { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Hook that provides login and signup functions with automatic navigation
 * based on user status
 */
export const useAuthWithNavigation = () => {
  const { login: authLogin, signup: authSignup, ...authRest } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const loginWithNavigation = useCallback(
    async (email: string, password: string) => {
      try {
        // Perform login and get userStatusId
        const result = await authLogin(email, password);

        // Initialize user status service if needed and navigate immediately
        if (!UserStatusService.getStatus(result.userStatusId)) {
          await UserStatusService.initialize();
        }

        // Execute navigation based on status
        console.log(
          'Executing immediate navigation for userStatusId:',
          result.userStatusId,
        );
        UserStatusService.executeStatusAction(result.userStatusId, navigation);
      } catch (error) {
        console.error('Login with navigation failed:', error);
        throw error;
      }
    },
    [authLogin, navigation],
  );

  const signupWithNavigation = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      try {
        // Perform signup and get userStatusId
        const result = await authSignup(email, password, firstName, lastName);

        // Initialize user status service if needed and navigate immediately
        if (!UserStatusService.getStatus(result.userStatusId)) {
          await UserStatusService.initialize();
        }

        // Execute navigation based on status
        console.log(
          'Executing immediate navigation for userStatusId:',
          result.userStatusId,
        );
        UserStatusService.executeStatusAction(result.userStatusId, navigation);
      } catch (error) {
        console.error('Signup with navigation failed:', error);
        throw error;
      }
    },
    [authSignup, navigation],
  );

  return {
    ...authRest,
    login: loginWithNavigation,
    signup: signupWithNavigation,
  };
};
