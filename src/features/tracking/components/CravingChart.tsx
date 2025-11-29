import React from 'react';
import { StyleProp, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { AppText, Box, AppPressable } from '@/shared/components/ui';
import {
  COLOR_PALETTE,
  DEVICE_HEIGHT,
  SPACING,
  BORDER_RADIUS,
} from '@/shared/theme';
import { DailyCravingData } from '@/features/tracking';
import { useCravingChartData } from '../hooks/useCravingChartData';

type CravingChartProps = {
  data: DailyCravingData[];
  style?: StyleProp<ViewStyle>;
};

const screenWidth = Dimensions.get('window').width;
// Calculate width based on screen padding (SPACING.xl * 2) and container padding (SPACING.lg * 2)
const chartWidth = screenWidth - SPACING.md * 6;

export const CravingChart = ({ data, style }: CravingChartProps) => {
  const { period, setPeriod, chartData } = useCravingChartData(data);

  if (!data || data.length === 0) {
    return (
      <Box
        bg="backgroundPrimary"
        borderRadius="medium"
        p="md"
        style={[styles.container, style]}
      >
        <AppText variant="heading" style={styles.title}>
          Cravings
        </AppText>
        <AppText variant="body" tone="secondary" style={styles.noDataText}>
          No craving data available
        </AppText>
      </Box>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: COLOR_PALETTE.backgroundMuted,
    backgroundGradientTo: COLOR_PALETTE.backgroundMuted,
    color: (opacity = 1) => `rgba(122, 62, 177, ${opacity})`, // Matches COLOR_PALETTE.craving
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
    <Box
      bg="backgroundPrimary"
      borderRadius="medium"
      p="md"
      style={[styles.container, style]}
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb="md"
      >
        <Box
          px="md"
          py="xs"
          borderRadius="full"
          bg="cravingLight"
          style={{ alignSelf: 'flex-start' }}
        >
          <AppText style={styles.titleBadgeText}>Cravings Resisted</AppText>
        </Box>
        <Box
          flexDirection="row"
          bg="backgroundMuted"
          borderRadius="small"
          p="xs"
        >
          <AppPressable
            variant="chip"
            selected={period === 'daily'}
            style={[
              styles.toggleButton,
              period === 'daily' && styles.activeToggle,
            ]}
            onPress={() => setPeriod('daily')}
          >
            <AppText
              variant="gridArea"
              style={[
                styles.toggleText,
                period === 'daily' && styles.activeToggleText,
              ]}
            >
              Daily
            </AppText>
          </AppPressable>
          <AppPressable
            variant="chip"
            selected={period === 'weekly'}
            style={[
              styles.toggleButton,
              period === 'weekly' && styles.activeToggle,
            ]}
            onPress={() => setPeriod('weekly')}
          >
            <AppText
              variant="gridArea"
              style={[
                styles.toggleText,
                period === 'weekly' && styles.activeToggleText,
              ]}
            >
              Weekly
            </AppText>
          </AppPressable>
        </Box>
      </Box>

      <Box
        alignItems="center"
        justifyContent="center"
        bg="backgroundMuted"
        borderRadius="small"
      >
        {chartData.labels.length < 4 ? (
          <BarChart
            data={barChartData}
            width={chartWidth}
            height={DEVICE_HEIGHT * 0.35}
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
            height={DEVICE_HEIGHT * 0.35}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            segments={4}
            fromZero={true}
          />
        )}
      </Box>
      <AppText variant="subcaption" style={styles.footerText}>
        Did you know most cravings peak for 3 minutes.? Focus on your breath and
        a small movement to help you stay calm.
      </AppText>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLOR_PALETTE.borderDefault,
    borderLeftColor: COLOR_PALETTE.craving,
    borderLeftWidth: 4,
  },
  title: {
    // marginBottom: SPACING.md, // Moved to header
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: COLOR_PALETTE.craving,
    borderColor: COLOR_PALETTE.craving,
  },
  toggleText: {
    color: COLOR_PALETTE.textMuted,
  },
  activeToggleText: {
    color: COLOR_PALETTE.textInverse,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
    paddingRight: SPACING.xl * 1.5,
    paddingLeft: SPACING.xl * 1.5,
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: SPACING.xl,
  },
  titleBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLOR_PALETTE.textPrimary,
  },
  footerText: {
    fontStyle: 'italic',
    color: COLOR_PALETTE.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
