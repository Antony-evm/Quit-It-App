import { useAuth } from '@/shared/auth';

/**
 * Custom hook to get the backend user ID for API calls
 * Throws an error if user is not authenticated or backend user ID is not available
 */
export const useBackendUserId = (): number => {
  const { getBackendUserId, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    throw new Error('User is not authenticated');
  }

  const backendUserId = getBackendUserId();

  if (!backendUserId) {
    throw new Error(
      'Backend user ID is not available. Please try logging in again.',
    );
  }

  return backendUserId;
};

/**
 * Custom hook to safely get the backend user ID for API calls
 * Returns null if user is not authenticated or backend user ID is not available
 */
export const useBackendUserIdSafe = (): number | null => {
  const { getBackendUserId, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return getBackendUserId();
};
