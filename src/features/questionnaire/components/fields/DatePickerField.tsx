import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AppText } from '@/shared/components/ui';
import {
  BORDER_RADIUS,
  BRAND_COLORS,
  COLOR_PALETTE,
  SPACING,
} from '@/shared/theme';
import { formatDisplayDate } from '../../utils/dateFormatting';
import CalendarIcon from '@/assets/calendar.svg';

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
  const [showPicker, setShowPicker] = useState(false);

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

  const handlePress = useCallback(() => {
    setShowPicker(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
      >
        <CalendarIcon
          width={24}
          height={24}
          color={BRAND_COLORS.cream}
          style={styles.icon}
        />
        <AppText variant="body" tone="primary" style={styles.text}>
          {value ? formatDisplayDate(value) : 'Select a date'}
        </AppText>
      </Pressable>

      {/* Date picker */}
      {showPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={currentValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={min}
            maximumDate={max}
            onChange={handleDateChange}
            style={styles.datePicker}
            themeVariant="dark"
            accentColor={BRAND_COLORS.mint}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.ink,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minHeight: 64,
  },
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  icon: {
    marginRight: SPACING.md,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
  pickerContainer: {
    marginTop: SPACING.sm,
    backgroundColor: BRAND_COLORS.ink,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  datePicker: {
    backgroundColor: BRAND_COLORS.ink,
    height: 320,
  },
});
