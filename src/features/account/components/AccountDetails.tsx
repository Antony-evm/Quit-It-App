import { useTranslation } from 'react-i18next';
import { Box, IconTextCard } from '@/shared/components/ui';
import { useAuth } from '@/shared/auth';
import EmailSvg from '@/assets/email.svg';

export const AccountDetails = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box mb="lg">
      <IconTextCard
        icon={EmailSvg}
        text={user?.email ?? t('account.emailPlaceholder')}
      />
    </Box>
  );
};
