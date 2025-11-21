import { useAuth } from '@/shared/auth';

/**
 * Hook to get the current authenticated backend user ID as a number
 * This returns the user ID from our backend, not the Stytch user ID
 * Falls back to a default value for development/testing
 */
export const useCurrentUserId = (): number => {
  const { getBackendUserId, user } = useAuth();

  // Get the backend user ID first
  const backendUserId = getBackendUserId();
  if (backendUserId) {
    return backendUserId;
  }

  // Fallback: Convert Stytch string user ID to number for development
  if (user?.id) {
    const numericId = parseInt(user.id, 10);
    return isNaN(numericId) ? 2 : numericId; // Default fallback
  }

  // Default user ID for unauthenticated state or development
  return 2;
};

/**
 * Hook to get the current authenticated user ID as a string
 * This returns the Stytch user ID as a string
 */
export const useCurrentUserIdString = (): string => {
  const { user } = useAuth();
  return user?.id || '2'; // Default string fallback
};
