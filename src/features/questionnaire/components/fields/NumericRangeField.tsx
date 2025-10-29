import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { AppText } from '../../../../shared/components/ui';
import { COLOR_PALETTE, SPACING } from '../../../../shared/theme';

type NumericRangeFieldProps = {
  minimum: number;
  maximum: number;
  value: number;
  onValueChange: (value: number) => void;
};

export const NumericRangeField = ({
  minimum,
  maximum,
  value,
  onValueChange,
}: NumericRangeFieldProps) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <AppText tone="secondary">
        Drag to select a value between {minimum} and {maximum}.
      </AppText>
      <AppText variant="title">{value}</AppText>
    </View>
    <Slider
      style={styles.slider}
      minimumValue={minimum}
      maximumValue={maximum}
      step={1}
      minimumTrackTintColor={COLOR_PALETTE.accentPrimary}
      maximumTrackTintColor={COLOR_PALETTE.borderDefault}
      thumbTintColor={COLOR_PALETTE.accentPrimary}
      value={value}
      onValueChange={(next) => onValueChange(Math.round(next))}
    />
    <View style={styles.labels}>
      <AppText tone="secondary">{minimum}</AppText>
      <AppText tone="secondary">{maximum}</AppText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
