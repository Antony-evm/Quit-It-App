import { useMemo, useState } from 'react';
import { DailyCravingData } from '@/features/tracking';
import { TAGS, hexToRgba } from '@/shared/theme';

export type ChartPeriod = 'daily' | 'weekly';

const DAILY_RANGE_DAYS = 7;
const WEEKLY_RANGE_WEEKS = 4;

export const useCravingChartData = (data: DailyCravingData[]) => {
  const [period, setPeriod] = useState<ChartPeriod>('daily');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the earliest date in the data
    const minDate = new Date(
      Math.min(...data.map(d => new Date(d.date).getTime())),
    );
    minDate.setHours(0, 0, 0, 0);

    if (period === 'daily') {
      const labels = [];
      const counts = [];

      for (let i = DAILY_RANGE_DAYS - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        if (d < minDate) continue;

        const dateStr = d.toISOString().split('T')[0];
        const record = data.find(item => item.date === dateStr);

        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        counts.push(record ? record.count : 0);
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
      const labels = [];
      const counts = [];

      for (let i = WEEKLY_RANGE_WEEKS - 1; i >= 0; i--) {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - i * 7);
        endDate.setHours(0, 0, 0, 0);

        if (endDate < minDate) continue;

        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        let weekCount = 0;

        data.forEach(item => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0);

          if (itemDate >= startDate && itemDate <= endDate) {
            weekCount += item.count;
          }
        });

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
