import { useTranslation } from 'react-i18next';

import { AppText, Box, ScreenHeader } from '@/shared/components/ui';

export const MilestonesScreen = () => {
  const { t } = useTranslation();

  return (
    <Box variant="default" flex={1}>
      <ScreenHeader
        title={t('milestones.screenTitle')}
        subtitle={t('milestones.screenSubtitle')}
      />
      <Box flex={1}>
        <AppText tone="muted">{t('milestones.comingSoon')}</AppText>
        <AppText tone="muted" style={{ marginTop: 8 }}>
          {t('milestones.placeholder')}
        </AppText>
      </Box>
    </Box>
  );
};
