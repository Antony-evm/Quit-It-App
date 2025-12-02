import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Box } from '@/shared/components/ui';

interface WelcomeTextProps {
  isSignup: boolean;
}

export const WelcomeText: React.FC<WelcomeTextProps> = ({ isSignup }) => {
  const { t } = useTranslation();

  const title = isSignup
    ? t('auth.welcomeSignupTitle')
    : t('auth.welcomeLoginTitle');
  const subtitle = isSignup
    ? t('auth.welcomeSignupSubtitle')
    : t('auth.welcomeLoginSubtitle');

  return (
    <Box alignItems="center" bg="primary" pt="xxl" gap="sm" pb="lg">
      <AppText variant="title" centered>
        {title}
      </AppText>
      <AppText variant="caption" centered>
        {subtitle}
      </AppText>
    </Box>
  );
};
