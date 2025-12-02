import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { AppText } from '@/shared/components/ui';

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
      onPress={onToggle}
      activeOpacity={0.9}
      disabled={isLoading}
    >
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
