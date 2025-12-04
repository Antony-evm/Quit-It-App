import { useCallback } from 'react';
import { useAppNavigation } from '@/navigation/hooks';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';

/**
 * Hook that provides login and signup functions with automatic navigation
 * based on user status
 */
export const useAuthWithNavigation = () => {
  const { login: authLogin, signup: authSignup, ...authRest } = useAuth();
  const navigation = useAppNavigation();

  const loginWithNavigation = useCallback(
    async (email: string, password: string) => {
      // Perform login and get userStatusId
      const result = await authLogin(email, password);

      // Initialize user status service if needed and navigate immediately
      if (!UserStatusService.isInitialized()) {
        await UserStatusService.initialize();
      }

      // Execute navigation based on status
      UserStatusService.executeStatusAction(result.userStatusId, navigation);
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
      // Perform signup and get userStatusId
      const result = await authSignup(email, password, firstName, lastName);

      // Initialize user status service if needed and navigate immediately
      if (!UserStatusService.isInitialized()) {
        await UserStatusService.initialize();
      }

      // Execute navigation based on status
      UserStatusService.executeStatusAction(result.userStatusId, navigation);
    },
    [authSignup, navigation],
  );

  return {
    ...authRest,
    login: loginWithNavigation,
    signup: signupWithNavigation,
  };
};
