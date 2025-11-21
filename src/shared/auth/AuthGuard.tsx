import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

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
      <View style={styles.container}>
        <AppText>Loading...</AppText>
      </View>
    );
  }

  // Show fallback or nothing if not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <View style={styles.container}>
        <AppText>Please log in to continue</AppText>
      </View>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    padding: SPACING.lg,
  },
});

export default AuthGuard;
