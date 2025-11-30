import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { AppText, Box } from '@/shared/components/ui';
import { TEXT, SYSTEM, INPUT_MIN_HEIGHT } from '@/shared/theme';

type NumericRangeFieldProps = {
  minimum: number;
  maximum: number;
  value: number | null;
  units?: string;
  onValueChange: (value: number) => void;
};

export const NumericRangeField = ({
  minimum,
  maximum,
  value,
  units,
  onValueChange,
}: NumericRangeFieldProps) => {
  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    onValueChange(roundedValue);
  };

  const displayValue = value ?? Math.floor((minimum + maximum) / 2);

  return (
    <Box gap="md">
      <Box variant="valuePill">
        <AppText variant="title">
          {displayValue}
          {units && ` ${units}`}
        </AppText>
      </Box>
      <Slider
        style={styles.slider}
        minimumValue={minimum}
        maximumValue={maximum}
        step={1}
        minimumTrackTintColor={TEXT.primary}
        maximumTrackTintColor={SYSTEM.border}
        thumbTintColor={TEXT.primary}
        value={displayValue}
        onValueChange={handleValueChange}
      />
      <Box flexDirection="row" justifyContent="space-between">
        <AppText variant="caption" tone="muted">
          {minimum}
        </AppText>
        <AppText variant="caption" tone="muted">
          {maximum}
        </AppText>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: INPUT_MIN_HEIGHT,
  },
});
