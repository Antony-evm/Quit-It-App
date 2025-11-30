import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { AppCard, AppText, Box } from '@/shared/components/ui';
import { SPACING, FOOTER_LAYOUT } from '@/shared/theme';
import { QuittingPlanCard } from '../components/QuittingPlanCard';
import { CravingChart } from '@/features/tracking';
import { HomeStatsRow } from '../components/HomeStatsRow';
import { WelcomeComponent } from '../components/WelcomeComponent';
import { useHomeDashboardStats } from '../hooks/useHomeDashboardStats';
import { useWelcomeData } from '../hooks/useWelcomeData';

export const HomeDashboardScreen = () => {
  const { dailyData, stats } = useHomeDashboardStats();
  const { title, message, timeDifference } = useWelcomeData();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <WelcomeComponent
        title={title}
        message={message}
        timeDifference={timeDifference}
      />

      <Box px="xl" gap="md">
        {dailyData && dailyData.length > 0 && (
          <CravingChart data={dailyData} style={styles.chartCard} />
        )}

        <HomeStatsRow stats={stats} />

        <Box mb="xl">
          <AppText variant="heading" style={styles.sectionTitle}>
            Your Plan
          </AppText>
          <AppCard style={styles.planCard}>
            <QuittingPlanCard />
          </AppCard>
        </Box>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl + FOOTER_LAYOUT.FAB_SIZE / 2,
  },
  planCard: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
  },
  chartCard: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
});
