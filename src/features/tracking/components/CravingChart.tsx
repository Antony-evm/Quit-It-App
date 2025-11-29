import React, { useState, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { AppText } from '@/shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '@/shared/theme';
import { DailyCravingData } from '@/features/tracking';

type CravingChartProps = {
  data: DailyCravingData[];
  style?: StyleProp<ViewStyle>;
};

const screenWidth = Dimensions.get('window').width;
// Calculate width based on screen padding (SPACING.xl * 2) and container padding (SPACING.lg * 2)
const chartWidth = screenWidth - SPACING.xl * 2 - SPACING.lg * 2;

export const CravingChart = ({ data, style }: CravingChartProps) => {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

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

      for (let i = 6; i >= 0; i--) {
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
            color: (opacity = 1) => `rgba(122, 62, 177, ${opacity})`,
            strokeWidth: 3,
          },
        ],
      };
    } else {
      // Weekly: Last 4 weeks (rolling 7-day windows)
      const labels = [];
      const counts = [];

      for (let i = 3; i >= 0; i--) {
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
            color: (opacity = 1) => `rgba(122, 62, 177, ${opacity})`,
            strokeWidth: 3,
          },
        ],
      };
    }
  }, [data, period]);

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <AppText variant="heading" style={styles.title}>
          Cravings
        </AppText>
        <AppText variant="body" tone="secondary" style={styles.noDataText}>
          No craving data available
        </AppText>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: COLOR_PALETTE.backgroundMuted,
    backgroundGradientTo: COLOR_PALETTE.backgroundMuted,
    color: (opacity = 1) => `rgba(122, 62, 177, ${opacity})`,
    labelColor: (opacity = 1) => COLOR_PALETTE.textMuted,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLOR_PALETTE.accentPrimary,
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'System',
    },
    propsForBackgroundLines: {
      stroke: COLOR_PALETTE.textMuted,
      strokeOpacity: 0.2,
      strokeDasharray: '', // Solid lines
    },
    fillShadowGradient: COLOR_PALETTE.craving,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
  };

  const barChartData = {
    ...chartData,
    datasets: chartData.datasets.map(ds => ({
      ...ds,
      color: (opacity = 1) => `rgba(122, 62, 177, ${opacity})`,
    })),
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <AppText variant="heading" style={styles.title}>
          Cravings
        </AppText>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              period === 'daily' && styles.activeToggle,
            ]}
            onPress={() => setPeriod('daily')}
          >
            <AppText
              style={[
                styles.toggleText,
                period === 'daily' && styles.activeToggleText,
              ]}
            >
              Daily
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              period === 'weekly' && styles.activeToggle,
            ]}
            onPress={() => setPeriod('weekly')}
          >
            <AppText
              style={[
                styles.toggleText,
                period === 'weekly' && styles.activeToggleText,
              ]}
            >
              Weekly
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {chartData.labels.length < 4 ? (
          <BarChart
            data={barChartData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
            withInnerLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            fromZero={true}
            showBarTops={false}
            flatColor={true}
          />
        ) : (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            segments={4}
            fromZero={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BRAND_COLORS.ink,
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    // marginBottom: SPACING.md, // Moved to header
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: COLOR_PALETTE.craving,
  },
  toggleText: {
    fontSize: 12,
    color: COLOR_PALETTE.textMuted,
  },
  activeToggleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_COLORS.inkDark,
    borderRadius: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: SPACING.xl,
  },
});
