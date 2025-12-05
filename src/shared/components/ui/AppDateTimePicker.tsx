import React, { useState, useCallback, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { AppPressable } from './AppPressable';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { Box, BoxProps } from './Box';
import { BACKGROUND, SYSTEM, SPACING } from '@/shared/theme';
import CalendarIcon from '@/assets/calendar.svg';

export type AppDateTimePickerProps = BoxProps & {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  label?: string;
  placeholder?: string;
  formatDisplay?: (date: Date) => string;
};

export const useAppDateTimePicker = ({
  value,
  onChange,
  mode = 'date',
  formatDisplay,
}: Pick<
  AppDateTimePickerProps,
  'value' | 'onChange' | 'mode' | 'formatDisplay'
>) => {
  const [showPicker, setShowPicker] = useState(false);
  const [androidMode, setAndroidMode] = useState<'date' | 'time'>('date');

  // Determine the effective mode for the picker component
  const pickerMode: 'date' | 'time' | 'datetime' =
    Platform.OS === 'android' && mode === 'datetime'
      ? androidMode
      : mode === 'datetime'
      ? 'datetime'
      : mode;

  const openPicker = useCallback(() => {
    if (Platform.OS === 'android' && mode === 'datetime') {
      setAndroidMode('date');
    }
    setShowPicker(prev => !prev);
  }, [mode]);

  const onDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        if (event.type === 'dismissed') {
          setShowPicker(false);
          return;
        }

        if (mode === 'datetime') {
          if (androidMode === 'date' && selectedDate) {
            // Update date part
            const newDate = new Date(value);
            newDate.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
            );
            onChange(newDate);

            // Switch to time picker
            setAndroidMode('time');
          } else if (androidMode === 'time' && selectedDate) {
            // Update time part
            const newDate = new Date(value);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes(),
            );
            onChange(newDate);
            setShowPicker(false);
            setAndroidMode('date'); // Reset
          }
        } else {
          // Simple date or time mode
          setShowPicker(false);
          if (selectedDate) {
            onChange(selectedDate);
          }
        }
      } else {
        // iOS handling
        if (selectedDate) {
          onChange(selectedDate);
        }
      }
    },
    [androidMode, mode, onChange, value],
  );

  const displayValue = useMemo(() => {
    if (formatDisplay) {
      return formatDisplay(value);
    }

    if (mode === 'time') {
      return value.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    if (mode === 'datetime') {
      return value.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    // Default date
    return value.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [value, mode, formatDisplay]);

  return {
    showPicker,
    pickerMode,
    displayValue,
    openPicker,
    onDateChange,
  };
};

export const AppDateTimePicker = ({
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
  label,
  placeholder = 'Select date',
  formatDisplay,
  ...boxProps
}: AppDateTimePickerProps) => {
  const { showPicker, pickerMode, displayValue, openPicker, onDateChange } =
    useAppDateTimePicker({
      value,
      onChange,
      mode,
      formatDisplay,
    });

  return (
    <Box {...boxProps}>
      {label && (
        <Box my="sm">
          <AppText variant="caption" tone="muted">
            {label}
          </AppText>
        </Box>
      )}

      <AppPressable variant="inputInverse" onPress={openPicker}>
        <AppIcon icon={CalendarIcon} style={{ marginRight: SPACING.md }} />
        <AppText variant="body" tone="primary">
          {displayValue || placeholder}
        </AppText>
      </AppPressable>

      {/* Picker Rendering */}
      {showPicker &&
        (Platform.OS === 'ios' ? (
          <Box
            mt="sm"
            bg="primary"
            borderRadius="medium"
            style={styles.iosPickerContainer}
          >
            <DateTimePicker
              value={value}
              mode={pickerMode}
              display="inline"
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={onDateChange}
              themeVariant="dark"
              accentColor={SYSTEM.brand}
              style={styles.iosPicker}
            />
          </Box>
        ) : (
          <DateTimePicker
            value={value}
            mode={pickerMode}
            is24Hour={false}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={onDateChange}
          />
        ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  iosPickerContainer: {
    overflow: 'hidden',
  },
  iosPicker: {
    backgroundColor: BACKGROUND.primary,
    // Height might be needed for inline picker if it doesn't size itself
  },
});
