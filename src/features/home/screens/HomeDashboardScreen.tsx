import { memo } from 'react';
import { ScrollView } from 'react-native';

import { Box, Section } from '@/shared/components/ui';
import { QuittingPlanCard } from '../components/QuittingPlanCard';
import { CravingChart } from '@/features/tracking';
import { HomeStatsRow } from '../components/HomeStatsRow';
import { WelcomeComponent } from '../components/WelcomeComponent';
import { useHomeDashboardStats } from '../hooks/useHomeDashboardStats';
import { useWelcomeData } from '../hooks/useWelcomeData';

export const HomeDashboardScreen = memo(() => {
  const { dailyData, stats } = useHomeDashboardStats();
  const { title, message, timeDifference } = useWelcomeData();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <WelcomeComponent
        title={title}
        message={message}
        timeDifference={timeDifference}
      />

      <Box px="xl" gap="md" pb="xxl">
        {dailyData && dailyData.length > 0 && (
          <Box variant="chartContainer">
            <CravingChart data={dailyData} />
          </Box>
        )}

        <HomeStatsRow stats={stats} />

        <Section title="Your Plan">
          <QuittingPlanCard />
        </Section>
      </Box>
    </ScrollView>
  );
});

HomeDashboardScreen.displayName = 'HomeDashboardScreen';
