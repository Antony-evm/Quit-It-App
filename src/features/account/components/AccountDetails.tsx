import { useTranslation } from 'react-i18next';
import { Box, IconTextCard } from '@/shared/components/ui';
import { useAuth } from '@/shared/auth';
import EmailSvg from '@/assets/email.svg';
import { UserDetailsCard } from './UserDetailsCard';

export const AccountDetails = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box gap="md">
      <UserDetailsCard />
      <IconTextCard
        icon={EmailSvg}
        text={user?.email ?? t('account.emailPlaceholder')}
      />
    </Box>
  );
};
