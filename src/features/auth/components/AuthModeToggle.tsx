import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Trans, useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <AppText variant="caption">
        <Trans
          i18nKey={isLoginMode ? 'auth.noAccount' : 'auth.hasAccount'}
          t={t}
          components={{
            link: <AppText link tone="brand" />,
          }}
        />
      </AppText>
    </TouchableOpacity>
  );
};
