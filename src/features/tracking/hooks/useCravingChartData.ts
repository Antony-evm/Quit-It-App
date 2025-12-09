import { useMemo, useState } from 'react';
import { DailyCravingData } from '@/features/tracking';
import { TAGS, hexToRgba } from '@/shared/theme';
import { formatDateToLocalString } from '@/utils/dateUtils';

export type ChartPeriod = 'daily' | 'weekly';

type ChartDataset = {
  data: number[];
  color: (opacity?: number) => string;
  strokeWidth: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

const DAILY_RANGE_DAYS = 12;
const WEEKLY_RANGE_WEEKS = 12;

export const useCravingChartData = (data: DailyCravingData[]) => {
  const [period, setPeriod] = useState<ChartPeriod>('daily');

  const chartData = useMemo<ChartData>(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const dataMap = new Map(data.map(d => [d.date, d.count]));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(
      Math.min(...data.map(d => new Date(d.date).getTime())),
    );
    minDate.setHours(0, 0, 0, 0);

    if (period === 'daily') {
      const labels: string[] = [];
      const counts: number[] = [];

      for (let i = DAILY_RANGE_DAYS - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        if (d < minDate) {
          continue;
        }

        const dateStr = formatDateToLocalString(d);
        const count = dataMap.get(dateStr) ?? 0;

        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        counts.push(count);
      }

      return {
        labels,
        datasets: [
          {
            data: counts,
            color: (opacity = 1) => hexToRgba(TAGS.craving, opacity),
            strokeWidth: 3,
          },
        ],
      };
    } else {
      const labels: string[] = [];
      const counts: number[] = [];

      for (let i = WEEKLY_RANGE_WEEKS - 1; i >= 0; i--) {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - i * 7);
        endDate.setHours(0, 0, 0, 0);

        if (endDate < minDate) {
          continue;
        }

        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        let weekCount = 0;

        // Iterate through each day in the week range
        for (let j = 0; j <= 6; j++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + j);
          const dateStr = formatDateToLocalString(d);
          weekCount += dataMap.get(dateStr) ?? 0;
        }

        labels.push(
          endDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
          }),
        );
        counts.push(weekCount);
      }

      return {
        labels,
        datasets: [
          {
            data: counts,
            color: (opacity = 1) => hexToRgba(TAGS.craving, opacity),
            strokeWidth: 3,
          },
        ],
      };
    }
  }, [data, period]);

  return {
    period,
    setPeriod,
    chartData,
  };
};
