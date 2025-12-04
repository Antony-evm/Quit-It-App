import { useTranslation } from 'react-i18next';

import { AppText, Box, ScreenHeader } from '@/shared/components/ui';

export const MilestonesScreen = () => {
  const { t } = useTranslation();

  return (
    <Box px="xl" pt="lg">
      <ScreenHeader
        title={t('milestones.screenTitle')}
        subtitle={t('milestones.screenSubtitle')}
      />
      <Box gap="md">
        <AppText tone="muted">{t('milestones.comingSoon')}</AppText>
        <AppText tone="muted">{t('milestones.placeholder')}</AppText>
      </Box>
    </Box>
  );
};
