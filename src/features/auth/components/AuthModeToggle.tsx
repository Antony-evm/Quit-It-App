import React from 'react';
import { TouchableOpacity } from 'react-native';
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
    <TouchableOpacity onPress={onToggle} activeOpacity={1} disabled={isLoading}>
      <AppText variant="caption">
        {isLoginMode
          ? "Don't have an account? Tap "
          : 'Already have an account? Tap '}
        <AppText link>here</AppText>
        {isLoginMode ? ' to sign up' : ' to login'}
      </AppText>
    </TouchableOpacity>
  );
};
