import { useAuth } from '@/shared/auth';

/**
 * Hook to get the current authenticated backend user ID
 * Returns null if not available - callers must handle this case
 */
export const useCurrentUserId = (): number | null => {
  const { getBackendUserId } = useAuth();
  return getBackendUserId();
};
