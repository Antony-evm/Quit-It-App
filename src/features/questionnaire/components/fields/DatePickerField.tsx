import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AppButton, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import {
  formatDisplayDate,
  getRelativeDateInfo,
} from '../../utils/dateFormatting';

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

export const DatePickerField = ({
  value,
  minimumDate,
  maximumDate,
  onChange,
}: DatePickerFieldProps) => {
  const min = useMemo(() => toDateOnly(minimumDate), [minimumDate]);
  const max = useMemo(() => toDateOnly(maximumDate), [maximumDate]);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  // Use minimum date as default if no value is provided
  const currentValue = value || min;

  const handleDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      // On Android, hide the picker after selection
      if (Platform.OS === 'android') {
        setShowPicker(false);
      }

      if (selectedDate) {
        const clamped = clampDate(toDateOnly(selectedDate), min, max);
        onChange(clamped);
      }
    },
    [max, min, onChange],
  );

  const handleShowPicker = useCallback(() => {
    if (Platform.OS === 'android') {
      setShowPicker(true);
    }
  }, []);

  const relativeInfo = getRelativeDateInfo(currentValue);

  return (
    <View style={styles.container}>
      {/* Visual indicator with selected date and contextual info */}
      <View style={styles.selectedDateDisplay}>
        <AppText variant="heading" style={styles.selectedDateText}>
          {formatDisplayDate(currentValue)}
        </AppText>
        {relativeInfo && (
          <AppText variant="body" tone="secondary" style={styles.relativeInfo}>
            {relativeInfo}
          </AppText>
        )}
      </View>

      {/* Date picker - always show on iOS, show on button press for Android */}
      {Platform.OS === 'android' && !showPicker ? (
        <View style={styles.buttonContainer}>
          <AppButton
            label="Change Date"
            onPress={handleShowPicker}
            variant="primary"
            fullWidth
          />
        </View>
      ) : null}

      {/* Inline date picker */}
      {showPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={currentValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'compact' : 'default'}
            minimumDate={min}
            maximumDate={max}
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  selectedDateDisplay: {
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  selectedDateText: {
    textAlign: 'center',
  },
  relativeInfo: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  datePicker: {
    backgroundColor: 'transparent',
  },
});
