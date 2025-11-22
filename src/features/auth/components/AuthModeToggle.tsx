import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { BRAND_COLORS, SPACING, TYPOGRAPHY } from '@/shared/theme';

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
      activeOpacity={1}
      disabled={isLoading}
    >
      <AppText variant="body" tone="inverse" style={styles.modeToggleText}>
        {isLoginMode ? (
          <>
            Don't have an account? Tap{' '}
            <Text style={styles.underlinedText}>here</Text> to sign up
          </>
        ) : (
          <>
            Already have an account? Tap{' '}
            <Text style={styles.underlinedText}>here</Text> to login
          </>
        )}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modeToggle: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  modeToggleText: {
    textAlign: 'center',
    ...TYPOGRAPHY.caption,
    color: BRAND_COLORS.cream,
  },
  underlinedText: {
    textDecorationLine: 'underline',
    ...TYPOGRAPHY.caption,
    color: BRAND_COLORS.cream,
  },
});
