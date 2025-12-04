import { useTranslation } from 'react-i18next';
import { Box, IconTextCard } from '@/shared/components/ui';
import { useAuth } from '@/shared/auth';
import AccountSvg from '@/assets/account.svg';

export const UserDetailsCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box gap="md">
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
    </Box>
  );
};
