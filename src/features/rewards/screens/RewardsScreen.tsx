import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppText, Box, ScreenHeader } from '@/shared/components/ui';

export const RewardsScreen = () => {
  const { t } = useTranslation();

  return (
    <Box variant="default" flex={1}>
      <ScreenHeader
        title={t('rewards.screenTitle')}
        subtitle={t('rewards.screenSubtitle')}
      />
      <Box flex={1}>
        <AppText tone="muted">{t('rewards.comingSoon')}</AppText>
        <AppText tone="muted" style={{ marginTop: 8 }}>
          {t('rewards.placeholder')}
        </AppText>
      </Box>
    </Box>
  );
};
