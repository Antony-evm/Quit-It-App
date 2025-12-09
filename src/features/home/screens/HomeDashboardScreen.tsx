import { memo, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { AppText, Box, ScreenHeader } from '@/shared/components/ui';
import { CravingChart } from '@/features/tracking';
import { HomeStatsRow } from '../components/HomeStatsRow';
import { useHomeDashboardStats } from '../hooks/useHomeDashboardStats';
import { useWelcomeData } from '../hooks/useWelcomeData';
import { getFormattedTimeDifference } from '@/utils/dateUtils';

type HomeDashboardScreenProps = {
  onCreateNote?: () => void;
};

export const HomeDashboardScreen = memo(
  ({ onCreateNote }: HomeDashboardScreenProps) => {
    const { dailyData, stats, totalCravings } = useHomeDashboardStats();
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
            <Box variant="statCard">
              <AppText variant="display" tone="brand">
                {timeDifference}
              </AppText>
            </Box>
          )}

          <Box mt="xl" mb="xxl">
            <CravingChart
              data={dailyData}
              totalCravings={totalCravings}
              onCreatePress={onCreateNote}
            />
          </Box>

          <HomeStatsRow stats={stats} />
        </ScrollView>
      </Box>
    );
  },
);

HomeDashboardScreen.displayName = 'HomeDashboardScreen';
