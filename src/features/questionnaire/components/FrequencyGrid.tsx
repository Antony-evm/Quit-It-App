import React from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
} from '../types';
import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { TimePeriodClock } from './TimePeriodClock';
import { useFrequencyGrid } from '../hooks/useFrequencyGrid';
import { parseTimeWindow } from '../utils/timeUtils';

type FrequencyGridProps = {
  options: AnswerOption[];
  subOptions: AnswerSubOption[];
  initialSubSelection?: SelectedAnswerSubOption[];
  onSubSelectionChange: (selection: SelectedAnswerSubOption[]) => void;
  onMainSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

export const FrequencyGrid = ({
  options,
  subOptions,
  initialSubSelection = [],
  onSubSelectionChange,
  onMainSelectionChange,
  onValidityChange,
}: FrequencyGridProps) => {
  const {
    selections,
    orderedSubOptions,
    enrichedMainOptions,
    handleSelectionChange,
  } = useFrequencyGrid({
    options,
    subOptions,
    initialSubSelection,
    onSubSelectionChange,
    onMainSelectionChange,
    onValidityChange,
  });

  const renderGridRow = (option: AnswerOption, index: number) => {
    const selectedIndex = orderedSubOptions.findIndex(
      sub => sub.id === selections[option.id],
    );
    const sliderValue = selectedIndex >= 0 ? selectedIndex : 0;

    const enrichedMainOption = enrichedMainOptions.find(
      opt => opt.id === option.id,
    );
    const timeInfo = enrichedMainOption || parseTimeWindow(option.value);

    const currentSub =
      selectedIndex >= 0 ? orderedSubOptions[selectedIndex] : null;

    return (
      <Box
        key={option.id}
        style={styles.gridRow}
        flexDirection="row"
        alignItems="center"
        py="sm"
        px="sm"
        gap="md"
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <Box alignItems="center" gap="xs" style={styles.clockContainer}>
            <TimePeriodClock
              startHour={timeInfo.startHour}
              endHour={timeInfo.endHour}
              size={60}
              padding={8}
            />
            <AppText variant="caption" style={styles.timeRangeText}>
              {timeInfo.hoursLabel}
            </AppText>
          </Box>
        </Box>
        <Box
          flex={3}
          justifyContent="center"
          alignItems="center"
          style={styles.sliderCell}
        >
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Math.max(orderedSubOptions.length - 1, 0)}
            step={1}
            value={sliderValue}
            minimumTrackTintColor={COLOR_PALETTE.textPrimary}
            maximumTrackTintColor={COLOR_PALETTE.borderDefault}
            thumbTintColor={COLOR_PALETTE.textPrimary}
            onValueChange={value =>
              handleSelectionChange(option.id, Math.round(value))
            }
          />
          <Box style={styles.frequencyDisplay}>
            {currentSub ? (
              <AppText variant="caption" style={styles.currentValueText}>
                {currentSub.value}
              </AppText>
            ) : (
              <AppText
                variant="caption"
                tone="primary"
                style={styles.currentValueText}
              >
                Select
              </AppText>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  if (options.length === 0 || subOptions.length === 0) {
    return (
      <Box my="md">
        <AppText variant="body" tone="primary">
          No frequency options available
        </AppText>
      </Box>
    );
  }

  return (
    <Box my="md">
      <Box borderRadius="small" style={styles.grid}>
        {options.map((option, index) => renderGridRow(option, index))}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  grid: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  optionCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
    width: 100,
  },
  timeRangeText: {
    color: COLOR_PALETTE.textPrimary,
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  sliderCell: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frequencyDisplay: {
    position: 'absolute',
    top: '35%',
    width: '90%',
    alignItems: 'flex-end',
  },
  slider: {
    width: '90%',
    alignSelf: 'center',
    height: 40,
  },
  currentValueText: {
    opacity: 0.8,
  },
  edgeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  edgeLabelsPlaceholder: {
    height: 16,
  },
  edgeLabel: {
    color: COLOR_PALETTE.textPrimary,
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badgeLabels: {
    gap: 2,
  },
  badgeLabelText: {
    opacity: 0.9,
    fontWeight: '700',
  },
  badgeHoursText: {
    opacity: 0.8,
  },
});
