import { memo, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { AppText, Box, ScreenHeader } from '@/shared/components/ui';
import { CravingChart } from '@/features/tracking';
import { HomeStatsRow } from '../components/HomeStatsRow';
import { useHomeDashboardStats } from '../hooks/useHomeDashboardStats';
import { useWelcomeData } from '../hooks/useWelcomeData';
import { getFormattedTimeDifference } from '@/utils/dateUtils';

export const HomeDashboardScreen = memo(() => {
  const { dailyData, stats } = useHomeDashboardStats();
  const { title, message, targetDate } = useWelcomeData();
  const [timeDifference, setTimeDifference] = useState('');

  useEffect(() => {
    if (!targetDate) {
      setTimeDifference('');
      return;
    }

    const updateTime = () => {
      const now = new Date();
      setTimeDifference(getFormattedTimeDifference(targetDate, now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const hasTimeDifference = Boolean(message && timeDifference);

  return (
    <Box variant="default">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader title={title} subtitle={message} />

        {hasTimeDifference && (
          <Box variant="highlightCard">
            <AppText variant="display" tone="brand">
              {timeDifference}
            </AppText>
          </Box>
        )}

        {dailyData && dailyData.length > 0 && (
          <Box mt="xl" mb="xxl">
            <CravingChart data={dailyData} />
          </Box>
        )}

        <HomeStatsRow stats={stats} />
      </ScrollView>
    </Box>
  );
});

HomeDashboardScreen.displayName = 'HomeDashboardScreen';
