import { useMemo } from 'react';
import { useCravingAnalytics, useSmokingAnalytics } from '@/features/tracking';
import { DailyCravingData } from '@/features/tracking/types';
import { TAGS, hexToRgba } from '@/shared/theme';
import { HomeStat } from '../components/HomeStatsRow';

export const useHomeDashboardStats = () => {
  const { data: cravingAnalytics, isLoading: isCravingLoading } =
    useCravingAnalytics();
  const { data: smokingAnalytics, isLoading: isSmokingLoading } =
    useSmokingAnalytics();

  // Convert cravings_by_day to daily_data format for the chart
  const dailyData = useMemo<DailyCravingData[]>(() => {
    if (!cravingAnalytics?.cravings_by_day) {
      return [];
    }
    return Object.entries(cravingAnalytics.cravings_by_day)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [cravingAnalytics?.cravings_by_day]);

  // Calculate dynamic stats based on analytics data
  const stats = useMemo<HomeStat[]>(
    () => [
      {
        id: 'cravings',
        label: 'Cravings',
        value: cravingAnalytics?.total_cravings?.toString() || '0',
        accentColor: TAGS.craving,
        tagLabel: 'Cravings',
        tagBackgroundColor: hexToRgba(TAGS.craving, 0.1),
        bottomLabel: 'Resisted',
      },
      {
        id: 'skipped-cigarettes',
        label: 'Skipped Cigarettes',
        value: smokingAnalytics?.skipped_smokes?.toString() || '0',
        accentColor: TAGS.cigarette,
        tagLabel: 'Smokes',
        tagBackgroundColor: hexToRgba(TAGS.cigarette, 0.1),
        bottomLabel: 'Skipped',
      },
      {
        id: 'money-saved',
        label: 'Money Saved',
        value: smokingAnalytics?.savings
          ? `$${smokingAnalytics.savings.toFixed(2)}`
          : '$0.00',
        accentColor: TAGS.wealth,
        tagLabel: 'Money',
        tagBackgroundColor: hexToRgba(TAGS.wealth, 0.1),
        bottomLabel: 'Saved',
      },
    ],
    [
      cravingAnalytics?.total_cravings,
      smokingAnalytics?.skipped_smokes,
      smokingAnalytics?.savings,
    ],
  );

  const isLoading = isCravingLoading || isSmokingLoading;

  return {
    dailyData,
    stats,
    isLoading,
  };
};
