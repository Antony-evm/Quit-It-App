import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { AppSurface, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { QuittingPlanCard } from '@/features/questionnaire/components/QuittingPlanCard';
import {
  useCravingAnalytics,
  useSmokingAnalytics,
  CravingChart,
} from '@/features/tracking';
import { DailyCravingData } from '@/features/tracking/types';
import { useQuittingPlan } from '@/features/questionnaire';
import { HomeStat, HomeStatsRow } from '../components/HomeStatsRow';
import { WelcomeComponent } from '../components/WelcomeComponent';

export const HomeDashboardScreen = () => {
  const { data: cravingAnalytics, isLoading, error } = useCravingAnalytics();
  const { data: smokingAnalytics } = useSmokingAnalytics();
  const { plan: quittingPlan } = useQuittingPlan();

  // Convert cravings_by_day to daily_data format for the chart
  const dailyData: DailyCravingData[] = cravingAnalytics?.cravings_by_day
    ? Object.entries(cravingAnalytics.cravings_by_day)
        .map(([date, count]) => ({
          date,
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  // Calculate dynamic stats based on analytics data
  const stats: HomeStat[] = [
    {
      label: 'Cravings',
      value: cravingAnalytics?.total_cravings?.toString() || '0',
      accentColor: COLOR_PALETTE.craving,
      tagLabel: 'Cravings',
      tagBackgroundColor: 'rgba(122, 62, 177, 0.1)',
      bottomLabel: 'Resisted',
    },
    {
      label: 'Skipped Cigarettes',
      value: smokingAnalytics?.skipped_smokes?.toString() || '0',
      accentColor: COLOR_PALETTE.cigarette,
      tagLabel: 'Smokes',
      tagBackgroundColor: 'rgba(214, 106, 61, 0.1)',
      bottomLabel: 'Skipped',
    },
    {
      label: 'Money Saved',
      value: smokingAnalytics?.savings
        ? `$${smokingAnalytics.savings.toFixed(2)}`
        : '$0.00',
      accentColor: COLOR_PALETTE.wealth,
      tagLabel: 'Money',
      tagBackgroundColor: 'rgba(16, 185, 129, 0.1)',
      bottomLabel: 'Saved',
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <WelcomeComponent />

      <View style={styles.homeContentContainer}>
        <HomeStatsRow stats={stats} style={styles.statsRow} />

        {dailyData && dailyData.length > 0 && (
          <CravingChart data={dailyData} style={styles.chartCard} />
        )}

        <View style={styles.planSection}>
          <AppText variant="heading" style={styles.sectionTitle}>
            Your Plan
          </AppText>
          <AppSurface style={styles.planCard}>
            <QuittingPlanCard />
          </AppSurface>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add padding for footer
  },
  homeContentContainer: {
    paddingHorizontal: SPACING.xl,
  },
  planCard: {
    marginBottom: SPACING.xl,
  },
  planSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
  },
  statsRow: {
    marginBottom: SPACING.xl,
  },
  chartCard: {
    marginBottom: SPACING.xl,
  },
});
