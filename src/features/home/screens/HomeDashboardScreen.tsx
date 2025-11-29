import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { AppSurface, AppText, Box } from '@/shared/components/ui';
import { SPACING, FOOTER_LAYOUT } from '@/shared/theme';
import { QuittingPlanCard } from '@/features/questionnaire/components/QuittingPlanCard';
import { CravingChart } from '@/features/tracking';
import { HomeStatsRow } from '../components/HomeStatsRow';
import { WelcomeComponent } from '../components/WelcomeComponent';
import { useHomeDashboardStats } from '../hooks/useHomeDashboardStats';

export const HomeDashboardScreen = () => {
  const { dailyData, stats } = useHomeDashboardStats();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <WelcomeComponent />

      <Box px="xl">
        {dailyData && dailyData.length > 0 && (
          <CravingChart data={dailyData} style={styles.chartCard} />
        )}

        <HomeStatsRow stats={stats} style={styles.statsRow} />

        <Box mb="xl">
          <AppText variant="heading" style={styles.sectionTitle}>
            Your Plan
          </AppText>
          <AppSurface style={styles.planCard}>
            <QuittingPlanCard />
          </AppSurface>
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
  statsRow: {
    marginBottom: SPACING.xl,
  },
  chartCard: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
});
