import { useAuth } from '@/shared/auth';

/**
 * Debug utility to log current user data and verify first/last name caching.
 */
export const useUserDataDebug = () => {
  const { user } = useAuth();

  const logUserData = () => {
    console.log('=== User Data Debug ===');
    console.log('User object:', user);
    console.log('First Name:', user?.firstName);
    console.log('Last Name:', user?.lastName);
    console.log('Combined Name:', user?.name);
    console.log('User Status ID:', user?.userStatusId);
    console.log('Backend User ID:', user?.backendUserId);
    console.log('Email:', user?.email);
    console.log('=====================');

    // Check if names are properly stored
    if (!user?.firstName && !user?.lastName) {
      console.warn(
        '[useUserDataDebug] firstName and lastName are not cached - bug still present',
      );
    } else {
      console.log(
        '[useUserDataDebug] firstName/lastName are properly cached',
      );
    }
  };

  return { logUserData, user };
};
