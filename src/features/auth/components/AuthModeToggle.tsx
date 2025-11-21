import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { BRAND_COLORS, SPACING } from '@/shared/theme';

interface AuthModeToggleProps {
  isLoginMode: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const AuthModeToggle: React.FC<AuthModeToggleProps> = ({
  isLoginMode,
  onToggle,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.modeToggle}
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <AppText variant="body" tone="inverse" style={styles.modeToggleText}>
        {isLoginMode
          ? "Don't have an account? Tap here to sign up"
          : 'Already have an account? Tap here to login'}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modeToggle: {
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(249, 246, 242, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(249, 246, 242, 0.1)',
  },
  modeToggleText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '500',
    color: BRAND_COLORS.cream,
  },
});
