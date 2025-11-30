import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
} from '../types';
import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';
import { TimePeriodClock } from './TimePeriodClock';
import { useFrequencyGrid } from '../hooks/useFrequencyGrid';

const SLIDER_WIDTH = '90%';
const SLIDER_HEIGHT = 40;

export type FrequencyGridRowData = {
  optionId: number;
  startHour: number;
  endHour: number;
  hoursLabel: string;
  sliderValue: number;
  currentValueLabel: string | null;
};

type FrequencyGridViewProps = {
  rows: FrequencyGridRowData[];
  maxSliderValue: number;
  onSliderChange: (optionId: number, value: number) => void;
};

// Dumb presentational component
export const FrequencyGridView = ({
  rows,
  maxSliderValue,
  onSliderChange,
}: FrequencyGridViewProps) => {
  if (rows.length === 0) {
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
      <Box variant="gridContainer">
        {rows.map(row => (
          <Box key={row.optionId} variant="gridRow">
            <Box flex={1} variant="centered">
              <Box variant="centered" gap="xs">
                <TimePeriodClock
                  startHour={row.startHour}
                  endHour={row.endHour}
                  size={60}
                  padding={8}
                />
                <AppText variant="subcaption">{row.hoursLabel}</AppText>
              </Box>
            </Box>
            <Box variant="sliderContainer">
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={maxSliderValue}
                step={1}
                value={row.sliderValue}
                minimumTrackTintColor={COLOR_PALETTE.textPrimary}
                maximumTrackTintColor={COLOR_PALETTE.borderDefault}
                thumbTintColor={COLOR_PALETTE.textPrimary}
                onValueChange={value =>
                  onSliderChange(row.optionId, Math.round(value))
                }
              />
              <Box variant="sliderOverlay">
                {row.currentValueLabel ? (
                  <AppText variant="caption">{row.currentValueLabel}</AppText>
                ) : (
                  <AppText variant="caption" tone="primary">
                    Select
                  </AppText>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Smart container component (maintains backwards compatibility)
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

  // Transform data for the presentational component
  const rows: FrequencyGridRowData[] = enrichedMainOptions.map(option => {
    const selectedIndex = orderedSubOptions.findIndex(
      sub => sub.id === selections[option.id],
    );
    const currentSub =
      selectedIndex >= 0 ? orderedSubOptions[selectedIndex] : null;

    return {
      optionId: option.id,
      startHour: option.startHour,
      endHour: option.endHour,
      hoursLabel: option.hoursLabel,
      sliderValue: selectedIndex >= 0 ? selectedIndex : 0,
      currentValueLabel: currentSub?.value ?? null,
    };
  });

  const maxSliderValue = Math.max(orderedSubOptions.length - 1, 0);

  return (
    <FrequencyGridView
      rows={rows}
      maxSliderValue={maxSliderValue}
      onSliderChange={handleSelectionChange}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    width: SLIDER_WIDTH,
    alignSelf: 'center',
    height: SLIDER_HEIGHT,
  },
});
