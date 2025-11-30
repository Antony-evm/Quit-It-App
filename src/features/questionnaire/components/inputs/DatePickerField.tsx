import { useCallback } from 'react';
import { AppDateTimePicker, Box } from '@/shared/components/ui';

type DatePickerFieldProps = {
  value: Date | null;
  minimumDate: Date;
  maximumDate: Date;
  onChange: (nextValue: Date) => void;
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
  const currentValue = value || minimumDate;

  const handleChange = useCallback(
    (selectedDate: Date) => {
      const clamped = clampDate(selectedDate, minimumDate, maximumDate);
      onChange(clamped);
    },
    [maximumDate, minimumDate, onChange],
  );

  return (
    <Box gap="md" style={{ width: '100%' }}>
      <AppDateTimePicker
        value={currentValue}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={handleChange}
        mode="datetime"
        placeholder="Select date & time"
      />
    </Box>
  );
};
