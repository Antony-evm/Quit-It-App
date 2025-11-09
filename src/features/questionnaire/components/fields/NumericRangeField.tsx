import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { AppText } from '../../../../shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '../../../../shared/theme';

type NumericRangeFieldProps = {
  minimum: number;
  maximum: number;
  value: number | null;
  onValueChange: (value: number) => void;
};

export const NumericRangeField = ({
  minimum,
  maximum,
  value,
  onValueChange,
}: NumericRangeFieldProps) => {
  const handleValueChange = (newValue: number) => {
    // If no value was set before, use the midpoint as initial value
    const roundedValue = Math.round(newValue);
    onValueChange(roundedValue);
  };

  const displayValue = value ?? Math.floor((minimum + maximum) / 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.valuePill}>
        <AppText variant="title">{displayValue}</AppText>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={minimum}
        maximumValue={maximum}
        step={1}
        minimumTrackTintColor={BRAND_COLORS.cream}
        maximumTrackTintColor={COLOR_PALETTE.borderDefault}
        thumbTintColor={BRAND_COLORS.cream}
        value={displayValue}
        onValueChange={handleValueChange}
      />
      <View style={styles.labels}>
        <AppText variant="caption" style={styles.rangeLabel}>
          {minimum}
        </AppText>
        <AppText variant="caption" style={styles.rangeLabel}>
          {maximum}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  header: {
    gap: SPACING.sm,
  },
  helperChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
  helperText: {
    marginTop: SPACING.xs,
  },
  valuePill: {
    borderRadius: 0,
    borderWidth: 0,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  slider: {
    width: '100%',
    height: 60,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    color: BRAND_COLORS.cream,
    opacity: 0.6,
  },
});
