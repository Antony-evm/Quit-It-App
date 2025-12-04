import { memo } from 'react';
import { ScrollView } from 'react-native';

import { Box } from '@/shared/components/ui';
import { CravingChart } from '@/features/tracking';
import { HomeStatsRow } from '../components/HomeStatsRow';
import { WelcomeComponent } from '../components/WelcomeComponent';
import { useHomeDashboardStats } from '../hooks/useHomeDashboardStats';
import { useWelcomeData } from '../hooks/useWelcomeData';

export const HomeDashboardScreen = memo(() => {
  const { dailyData, stats } = useHomeDashboardStats();
  const { title, message, targetDate } = useWelcomeData();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <WelcomeComponent
        title={title}
        message={message}
        targetDate={targetDate}
      />

      <Box px="xl" gap="md" pb="xxl">
        {dailyData && dailyData.length > 0 && (
          <Box mt="sm" mb="xl">
            <CravingChart data={dailyData} />
          </Box>
        )}

        <HomeStatsRow stats={stats} />
      </Box>
    </ScrollView>
  );
});

HomeDashboardScreen.displayName = 'HomeDashboardScreen';
