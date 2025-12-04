import { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { AppText, AppTag, Box, AppPressable } from '@/shared/components/ui';
import {
  BACKGROUND,
  TEXT,
  TAGS,
  SYSTEM,
  DEVICE_HEIGHT,
  SPACING,
  BORDER_RADIUS,
  BORDER_WIDTH,
  SHADOWS,
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
        bg="primary"
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
    backgroundGradientFrom: BACKGROUND.muted,
    backgroundGradientTo: BACKGROUND.muted,
    color: (opacity = 1) => hexToRgba(TAGS.craving, opacity),
    labelColor: () => TEXT.muted,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: SYSTEM.accentPrimary,
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'System',
    },
    propsForBackgroundLines: {
      stroke: TEXT.muted,
      strokeOpacity: 0.2,
      strokeDasharray: '',
    },
    fillShadowGradient: TAGS.craving,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
  };

  const barChartData = {
    ...chartData,
    datasets: chartData.datasets.map(ds => ({
      ...ds,
      color: (opacity = 1) => hexToRgba(TAGS.craving, opacity),
    })),
  };

  return (
    <Box
      bg="primary"
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
        <AppTag label="Cravings Resisted" size="small" color={TAGS.craving} />
        <Box variant="toggleGroup">
          <AppPressable
            selected={period === 'daily'}
            style={[
              styles.toggleItem,
              period === 'daily' && styles.activeToggle,
            ]}
            onPress={() => setPeriod('daily')}
            accessibilityLabel="Show daily cravings"
            accessibilityRole="button"
            accessibilityState={{ selected: period === 'daily' }}
          >
            <AppText
              variant="caption"
              tone={period === 'daily' ? 'muted' : 'primary'}
              bold={period === 'daily'}
            >
              Daily
            </AppText>
          </AppPressable>
          <AppPressable
            selected={period === 'weekly'}
            style={[
              styles.toggleItem,
              period === 'weekly' && styles.activeToggle,
            ]}
            onPress={() => setPeriod('weekly')}
            accessibilityLabel="Show weekly cravings"
            accessibilityRole="button"
            accessibilityState={{ selected: period === 'weekly' }}
          >
            <AppText
              variant="caption"
              tone={period === 'weekly' ? 'muted' : 'primary'}
              bold={period === 'weekly'}
            >
              Weekly
            </AppText>
          </AppPressable>
        </Box>
      </Box>

      <Box
        justifyContent="center"
        alignItems="center"
        bg="muted"
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
    borderColor: SYSTEM.border,
    borderLeftColor: TAGS.craving,
    borderLeftWidth: BORDER_WIDTH.lg,
  },
  activeToggle: {
    backgroundColor: TAGS.craving,
    borderColor: TAGS.craving,
    ...SHADOWS.sm,
  },
  toggleItem: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small - 2,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.small,
    paddingRight: SPACING.xl * 1.5,
    paddingLeft: SPACING.xl * 1.5,
  },
});
