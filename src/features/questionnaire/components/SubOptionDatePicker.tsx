import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type {
  AnswerSubOption,
  SelectedAnswerSubOption,
  AnswerType,
} from '../types';
import { AppText } from '@/shared/components/ui';
import { DatePickerField } from './fields/DatePickerField';
import { SPACING } from '@/shared/theme';
import {
  formatDateForSubmission,
  parseSubmissionDateValue,
} from '../utils/dateFormatting';

type SubOptionDatePickerProps = {
  subOptions: AnswerSubOption[];
  initialSelection?: SelectedAnswerSubOption[];
  onSelectionChange: (selection: SelectedAnswerSubOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

const parseDateWindowInDays = (value: string) => {
  const numeric = parseInt(value, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
};

export const SubOptionDatePicker = ({
  subOptions,
  initialSelection,
  onSelectionChange,
  onValidityChange,
}: SubOptionDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // For N:1, we use the first sub-option as the date configuration
  const dateSubOption = subOptions[0];

  const dateWindowDays = useMemo(() => {
    if (!dateSubOption) {
      return 0;
    }
    return parseDateWindowInDays(dateSubOption.value);
  }, [dateSubOption]);

  const dateBounds = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limit = new Date(today);
    limit.setDate(limit.getDate() + dateWindowDays);
    return { min: today, max: limit };
  }, [dateWindowDays]);

  // Initialize from existing selection
  useEffect(() => {
    if (initialSelection && initialSelection.length > 0) {
      const initialDateValue = initialSelection[0]?.value ?? '';
      const parsedInitialDate = initialDateValue
        ? parseSubmissionDateValue(initialDateValue)
        : null;

      if (parsedInitialDate) {
        setSelectedDate(parsedInitialDate);
      } else {
        // Default to today if no valid initial date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setSelectedDate(today);
      }
    } else {
      // Default to today for new selection
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
    }
  }, [initialSelection]);

  // Update parent when selection changes
  useEffect(() => {
    if (!dateSubOption || !selectedDate) {
      onSelectionChange([]);
      onValidityChange?.(false);
      return;
    }

    const selection: SelectedAnswerSubOption[] = [
      {
        optionId: dateSubOption.id,
        value: formatDateForSubmission(selectedDate),
        answerType: 'date' as AnswerType,
        combination: dateSubOption.combination,
      },
    ];

    onSelectionChange(selection);
    onValidityChange?.(true);
  }, [dateSubOption, selectedDate, onSelectionChange, onValidityChange]);

  if (!dateSubOption) {
    return (
      <View style={styles.container}>
        <AppText tone="primary">No date sub-option available.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DatePickerField
        value={selectedDate}
        minimumDate={dateBounds.min}
        maximumDate={dateBounds.max}
        onChange={setSelectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
  },
});
