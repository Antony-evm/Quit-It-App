import { useCallback, useMemo } from 'react';
import { useCravingAnalytics, useSmokingAnalytics } from '@/features/tracking';
import { DailyCravingData } from '@/features/tracking/types';
import { TAGS } from '@/shared/theme';
import { HomeStat } from '../components/HomeStatsRow';

const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useHomeDashboardStats = () => {
  const {
    data: cravingAnalytics,
    isLoading: isCravingLoading,
    isError: isCravingError,
    error: cravingError,
    refetch: refetchCraving,
  } = useCravingAnalytics();
  const {
    data: smokingAnalytics,
    isLoading: isSmokingLoading,
    isError: isSmokingError,
    error: smokingError,
    refetch: refetchSmoking,
  } = useSmokingAnalytics();

  // Convert cravings_by_day to daily_data format for the chart
  const dailyData = useMemo<DailyCravingData[]>(() => {
    if (
      !cravingAnalytics?.cravings_by_day ||
      Object.keys(cravingAnalytics.cravings_by_day).length === 0
    ) {
      return [{ date: getTodayDateString(), count: 0 }];
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
        value: cravingAnalytics?.total_cravings?.toString() ?? '0',
        accentColor: TAGS.craving,
        tagLabel: 'Cravings',
        bottomLabel: 'Resisted',
      },
      {
        id: 'skipped-cigarettes',
        label: 'Skipped Cigarettes',
        value: smokingAnalytics?.skipped_smokes?.toString() ?? '0',
        accentColor: TAGS.cigarette,
        tagLabel: 'Smokes',
        bottomLabel: 'Skipped',
      },
      {
        id: 'money-saved',
        label: 'Money Saved',
        value:
          smokingAnalytics?.savings != null
            ? `$${smokingAnalytics.savings.toFixed(2)}`
            : '$0.00',
        accentColor: TAGS.wealth,
        tagLabel: 'Money',
        bottomLabel: 'Saved',
      },
    ],
    [
      cravingAnalytics?.total_cravings,
      smokingAnalytics?.skipped_smokes,
      smokingAnalytics?.savings,
    ],
  );

  const refetchAll = useCallback(async () => {
    await Promise.all([refetchCraving(), refetchSmoking()]);
  }, [refetchCraving, refetchSmoking]);

  return {
    dailyData,
    stats,
    totalCravings: cravingAnalytics?.total_cravings,
    // Craving analytics state
    isCravingLoading,
    isCravingError,
    cravingError,
    refetchCraving,
    // Smoking analytics state
    isSmokingLoading,
    isSmokingError,
    smokingError,
    refetchSmoking,
    // Combined state
    isLoading: isCravingLoading || isSmokingLoading,
    isError: isCravingError || isSmokingError,
    refetchAll,
  };
};
