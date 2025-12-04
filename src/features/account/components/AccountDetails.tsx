import { useTranslation } from 'react-i18next';
import { Box, IconTextCard } from '@/shared/components/ui';
import { useAuth } from '@/shared/auth';
import AccountSvg from '@/assets/account.svg';
import EmailSvg from '@/assets/email.svg';

export const AccountDetails = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box gap="md" mt="md">
      <IconTextCard
        icon={AccountSvg}
        text={user?.firstName ?? t('account.firstNamePlaceholder')}
        label={t('auth.firstNamePlaceholder')}
        iconOpacity={0.6}
      />
      <IconTextCard
        icon={AccountSvg}
        text={user?.lastName ?? t('account.lastNamePlaceholder')}
        label={t('auth.lastNamePlaceholder')}
        iconOpacity={0.6}
      />
      <IconTextCard
        icon={EmailSvg}
        text={user?.email ?? t('account.emailPlaceholder')}
        label={t('auth.emailPlaceholder')}
        iconOpacity={0.6}
      />
    </Box>
  );
};
