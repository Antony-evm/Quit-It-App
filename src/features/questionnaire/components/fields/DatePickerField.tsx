import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { AppButton, AppText, AppTextInput } from '../../../../shared/components/ui';
import { SPACING } from '../../../../shared/theme';

type DatePickerFieldProps = {
  value: Date | null;
  minimumDate: Date;
  maximumDate: Date;
  onChange: (nextValue: Date) => void;
};

const toDateOnly = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const clampDate = (value: Date, min: Date, max: Date) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const formatIsoDate = (date: Date) => date.toISOString().split('T')[0];

const formatDisplayDate = (date: Date | null) =>
  date ? date.toLocaleDateString() : 'Select a date';

export const DatePickerField = ({
  value,
  minimumDate,
  maximumDate,
  onChange,
}: DatePickerFieldProps) => {
  const min = useMemo(() => toDateOnly(minimumDate), [minimumDate]);
  const max = useMemo(() => toDateOnly(maximumDate), [maximumDate]);
  const [manualValue, setManualValue] = useState<string>(
    value ? formatIsoDate(value) : '',
  );

  useEffect(() => {
    setManualValue(value ? formatIsoDate(value) : '');
  }, [value]);

  const commitDate = useCallback(
    (candidate: Date) => {
      const clamped = clampDate(toDateOnly(candidate), min, max);
      onChange(clamped);
    },
    [max, min, onChange],
  );

  const handleAndroidPick = useCallback(() => {
    DateTimePickerAndroid.open({
      value: value ? toDateOnly(value) : min,
      onChange: (_, selectedDate) => {
        if (selectedDate) {
          commitDate(selectedDate);
        }
      },
      mode: 'date',
      minimumDate: min,
      maximumDate: max,
    });
  }, [commitDate, max, min, value]);

  const handleManualBlur = useCallback(() => {
    if (!manualValue) {
      return;
    }
    const candidate = new Date(manualValue);
    if (!Number.isNaN(candidate.getTime())) {
      commitDate(candidate);
    }
  }, [commitDate, manualValue]);

  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <AppText tone="secondary">
          Pick a date within the allowed range.
        </AppText>
        <AppButton label={formatDisplayDate(value)} onPress={handleAndroidPick} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText tone="secondary">
        Enter a date within the allowed range (YYYY-MM-DD).
      </AppText>
      <AppTextInput
        value={manualValue}
        onChangeText={setManualValue}
        onBlur={handleManualBlur}
        placeholder={`${formatIsoDate(min)} - ${formatIsoDate(max)}`}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
});
