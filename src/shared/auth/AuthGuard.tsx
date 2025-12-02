import React from 'react';
import { useAuth } from './AuthContext';
import { AppText, Box } from '@/shared/components/ui';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders children if user is authenticated
 * Shows loading state while checking authentication
 * Can show custom fallback or redirect to login
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        bg="muted"
        p="lg"
      >
        <AppText>Loading...</AppText>
      </Box>
    );
  }

  // Show fallback or nothing if not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        bg="muted"
        p="lg"
      >
        <AppText>Please log in to continue</AppText>
      </Box>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;
