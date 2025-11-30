import { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { AppText, AppTag, Box, AppPressable } from '@/shared/components/ui';
import {
  COLOR_PALETTE,
  DEVICE_HEIGHT,
  SPACING,
  BORDER_RADIUS,
  BORDER_WIDTH,
  hexToRgba,
} from '@/shared/theme';
import { DailyCravingData } from '@/features/tracking';
import { useCravingChartData } from '../hooks/useCravingChartData';

type CravingChartProps = {
  data: DailyCravingData[];
  style?: StyleProp<ViewStyle>;
};

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - SPACING.md * 6;

export const CravingChart = memo(function CravingChart({
  data,
  style,
}: CravingChartProps) {
  const { period, setPeriod, chartData } = useCravingChartData(data);

  if (!data || data.length === 0) {
    return (
      <Box
        bg="backgroundPrimary"
        borderRadius="medium"
        p="md"
        style={[styles.container, style]}
      >
        <AppText variant="heading">Cravings</AppText>
        <Box py="xl">
          <AppText variant="body" tone="secondary" centered italic>
            No craving data available
          </AppText>
        </Box>
      </Box>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: COLOR_PALETTE.backgroundMuted,
    backgroundGradientTo: COLOR_PALETTE.backgroundMuted,
    color: (opacity = 1) => hexToRgba(COLOR_PALETTE.craving, opacity),
    labelColor: () => COLOR_PALETTE.textMuted,
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
      strokeDasharray: '',
    },
    fillShadowGradient: COLOR_PALETTE.craving,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
  };

  const barChartData = {
    ...chartData,
    datasets: chartData.datasets.map(ds => ({
      ...ds,
      color: (opacity = 1) => hexToRgba(COLOR_PALETTE.craving, opacity),
    })),
  };

  return (
    <Box
      bg="backgroundPrimary"
      borderRadius="medium"
      p="md"
      style={[styles.container, style]}
    >
      <Box variant="noteHeader" mb="md">
        <AppTag
          label="Cravings Resisted"
          size="small"
          color={hexToRgba(COLOR_PALETTE.craving, 0.1)}
          textColor={COLOR_PALETTE.textPrimary}
        />
        <Box variant="toggleGroup">
          <AppPressable
            variant="chip"
            selected={period === 'daily'}
            style={period === 'daily' && styles.activeToggle}
            onPress={() => setPeriod('daily')}
            accessibilityLabel="Show daily cravings"
            accessibilityRole="button"
            accessibilityState={{ selected: period === 'daily' }}
          >
            <AppText
              variant="gridArea"
              tone={period === 'daily' ? 'inverse' : 'muted'}
              bold={period === 'daily'}
            >
              Daily
            </AppText>
          </AppPressable>
          <AppPressable
            variant="chip"
            selected={period === 'weekly'}
            style={period === 'weekly' && styles.activeToggle}
            onPress={() => setPeriod('weekly')}
            accessibilityLabel="Show weekly cravings"
            accessibilityRole="button"
            accessibilityState={{ selected: period === 'weekly' }}
          >
            <AppText
              variant="gridArea"
              tone={period === 'weekly' ? 'inverse' : 'muted'}
              bold={period === 'weekly'}
            >
              Weekly
            </AppText>
          </AppPressable>
        </Box>
      </Box>

      <Box variant="centered" bg="backgroundMuted" borderRadius="small">
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
      <Box mt="md">
        <AppText variant="subcaption" tone="muted" centered italic>
          Did you know most cravings peak for 3 minutes? Focus on your breath
          and a small movement to help you stay calm.
        </AppText>
      </Box>
    </Box>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: BORDER_WIDTH.md,
    borderColor: COLOR_PALETTE.borderDefault,
    borderLeftColor: COLOR_PALETTE.craving,
    borderLeftWidth: BORDER_WIDTH.lg,
  },
  activeToggle: {
    backgroundColor: COLOR_PALETTE.craving,
    borderColor: COLOR_PALETTE.craving,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.small,
    paddingRight: SPACING.xl * 1.5,
    paddingLeft: SPACING.xl * 1.5,
  },
});
