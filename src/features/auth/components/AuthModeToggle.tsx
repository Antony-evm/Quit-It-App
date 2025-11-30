import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, TYPOGRAPHY } from '@/shared/theme';

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
    <TouchableOpacity onPress={onToggle} activeOpacity={1} disabled={isLoading}>
      <AppText variant="caption">
        {isLoginMode ? (
          <>
            Don't have an account? Tap{' '}
            <Text style={{ textDecorationLine: 'underline' }}>here</Text> to
            sign up
          </>
        ) : (
          <>
            Already have an account? Tap{' '}
            <Text style={{ textDecorationLine: 'underline' }}>here</Text> to
            login
          </>
        )}
      </AppText>
    </TouchableOpacity>
  );
};
