import React from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

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
    // If no value was set before, use the midpoint as initial value
    const roundedValue = Math.round(newValue);
    onValueChange(roundedValue);
  };

  const displayValue = value ?? Math.floor((minimum + maximum) / 2);

  return (
    <Box gap="md">
      <Box gap="sm" />
      <Box
        py="sm"
        px="lg"
        bg="backgroundMuted"
        alignItems="center"
        gap="xs"
        style={styles.valuePill}
      >
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
        minimumTrackTintColor={COLOR_PALETTE.textPrimary}
        maximumTrackTintColor={COLOR_PALETTE.borderDefault}
        thumbTintColor={COLOR_PALETTE.textPrimary}
        value={displayValue}
        onValueChange={handleValueChange}
      />
      <Box flexDirection="row" justifyContent="space-between">
        <AppText variant="caption" style={styles.rangeLabel}>
          {minimum}
        </AppText>
        <AppText variant="caption" style={styles.rangeLabel}>
          {maximum}
        </AppText>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  valuePill: {
    borderRadius: 0,
    borderWidth: 0,
  },
  slider: {
    width: '100%',
    height: 60,
  },
  rangeLabel: {
    color: COLOR_PALETTE.textPrimary,
    opacity: 0.6,
  },
});
