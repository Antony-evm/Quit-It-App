import React, { useEffect } from 'react';
import { useAppNavigation } from '@/navigation/hooks';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';

interface StatusNavigationHandlerProps {
  children: React.ReactNode;
}

/**
 * Component that handles navigation based on user status after authentication
 */
export const StatusNavigationHandler: React.FC<
  StatusNavigationHandlerProps
> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigation = useAppNavigation();

  useEffect(() => {
    const handleStatusBasedNavigation = async () => {
      // Don't navigate if still loading, not authenticated, or no user
      if (isLoading || !isAuthenticated || !user?.userStatusId) {
        return;
      }

      try {
        // Execute the status action which will handle navigation
        UserStatusService.executeStatusAction(user.userStatusId, navigation);
      } catch (error) {
        // Fallback to home if something goes wrong
        navigation.navigate('Home');
      }
    };

    handleStatusBasedNavigation();
  }, [isAuthenticated, isLoading, user?.userStatusId, navigation]);

  return <>{children}</>;
};
