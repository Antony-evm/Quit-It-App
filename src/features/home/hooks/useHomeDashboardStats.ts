import { useCravingAnalytics, useSmokingAnalytics } from '@/features/tracking';
import { DailyCravingData } from '@/features/tracking/types';
import { COLOR_PALETTE } from '@/shared/theme';
import { HomeStat } from '../components/HomeStatsRow';

export const useHomeDashboardStats = () => {
  const { data: cravingAnalytics, isLoading: isCravingLoading } =
    useCravingAnalytics();
  const { data: smokingAnalytics, isLoading: isSmokingLoading } =
    useSmokingAnalytics();

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
      tagBackgroundColor: COLOR_PALETTE.cravingLight,
      bottomLabel: 'Resisted',
    },
    {
      label: 'Skipped Cigarettes',
      value: smokingAnalytics?.skipped_smokes?.toString() || '0',
      accentColor: COLOR_PALETTE.cigarette,
      tagLabel: 'Smokes',
      tagBackgroundColor: COLOR_PALETTE.cigaretteLight,
      bottomLabel: 'Skipped',
    },
    {
      label: 'Money Saved',
      value: smokingAnalytics?.savings
        ? `$${smokingAnalytics.savings.toFixed(2)}`
        : '$0.00',
      accentColor: COLOR_PALETTE.wealth,
      tagLabel: 'Money',
      tagBackgroundColor: COLOR_PALETTE.wealthLight,
      bottomLabel: 'Saved',
    },
  ];

  return {
    dailyData,
    stats,
    isLoading: isCravingLoading || isSmokingLoading,
  };
};
