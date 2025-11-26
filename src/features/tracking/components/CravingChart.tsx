import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { DailyCravingData } from '@/features/tracking';

type CravingChartProps = {
  data: DailyCravingData[];
  style?: StyleProp<ViewStyle>;
};

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - SPACING.lg * 2;

export const CravingChart = ({ data, style }: CravingChartProps) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <AppText variant="heading" style={styles.title}>
          Cravings This Week
        </AppText>
        <AppText variant="body" tone="secondary" style={styles.noDataText}>
          No craving data available
        </AppText>
      </View>
    );
  }

  // Get the last 7 days of data or all available data if less than 7 days
  const chartData = data.slice(-7);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const chartConfig = {
    backgroundGradientFrom: COLOR_PALETTE.backgroundPrimary,
    backgroundGradientTo: COLOR_PALETTE.backgroundPrimary,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Primary color
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
    decimalPlaces: 0, // No decimal places for craving counts
  };

  const lineChartData = {
    labels: chartData.map(d => formatDate(d.date)),
    datasets: [
      {
        data: chartData.map(d => d.count),
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Primary color
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={[styles.container, style]}>
      <AppText variant="heading" style={styles.title}>
        Cravings This Week
      </AppText>
      <View style={styles.chartContainer}>
        <LineChart
          data={lineChartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          segments={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  title: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
