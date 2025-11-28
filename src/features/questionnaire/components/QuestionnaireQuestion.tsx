import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Question, SelectedAnswerOption } from '../types';
import { AppText } from '@/shared/components/ui';
import { AnswerTabs } from './controls/AnswerTabs';
import { DatePickerField } from './fields/DatePickerField';
import { NumericRangeField } from './fields/NumericRangeField';
import { TimeSlotSelector } from './fields/TimeSlotSelector';
import { SPACING } from '@/shared/theme';
import {
  formatDateForSubmission,
  parseSubmissionDateValue,
} from '../utils/dateFormatting';

type QuestionnaireQuestionProps = {
  question: Question | null;
  initialSelection?: SelectedAnswerOption[];
  onSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

const parseNumericRange = (value: string) => {
  const [minRaw, maxRaw] = value.split('-').map(part => Number(part.trim()));

  if (Number.isNaN(minRaw) || Number.isNaN(maxRaw)) {
    return null;
  }

  const min = Math.min(minRaw, maxRaw);
  const max = Math.max(minRaw, maxRaw);

  return { min, max };
};

const resolveNumericDefault = (
  range: { min: number; max: number } | null,
  rawDefault: number | null,
) => {
  if (!range) {
    return null;
  }

  const midpoint = range.min + Math.floor((range.max - range.min) / 2);

  if (rawDefault === null || Number.isNaN(rawDefault)) {
    return midpoint;
  }

  const rounded = Math.round(rawDefault);
  if (rounded < range.min) {
    return range.min;
  }
  if (rounded > range.max) {
    return range.max;
  }

  return rounded;
};

const parseDateWindowInDays = (value: string) => {
  const numeric = parseInt(value, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const ensureSelectionValidity = (
  selection: SelectedAnswerOption[],
  onValidityChange?: (isValid: boolean) => void,
) => {
  onValidityChange?.(selection.length > 0);
};

const areSelectionsEqual = (
  a: SelectedAnswerOption[],
  b: SelectedAnswerOption[],
) =>
  a.length === b.length &&
  a.every((item, index) => {
    const other = b[index];
    return (
      other?.optionId === item.optionId &&
      other.value === item.value &&
      other.answerType === item.answerType &&
      other.nextVariationId === item.nextVariationId
    );
  });

export const QuestionnaireQuestion = ({
  question,
  initialSelection,
  onSelectionChange,
  onValidityChange,
}: QuestionnaireQuestionProps) => {
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<number[]>([]);
  const [numericRange, setNumericRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [numericSelection, setNumericSelection] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const allowMultipleChoice =
    question?.answerType === 'multiple_choice' &&
    question?.answerHandling === 'all';

  const allowSingleChoice =
    question?.answerType === 'multiple_choice' &&
    question?.answerHandling === 'single';

  const isNumericRangeQuestion =
    question?.answerType === 'numeric' && question?.answerHandling === 'range';

  const isTimeRangeQuestion =
    question?.answerType === 'time' && question?.answerHandling === 'all';

  const isDateQuestion =
    question?.answerType === 'date' && question?.answerHandling === 'max';

  const firstOption = question?.options[0];
  const previousSelectionRef = useRef<SelectedAnswerOption[]>([]);

  // Create a stable key for initialSelection to prevent constant re-initialization
  const initialSelectionKey = useMemo(() => {
    if (!initialSelection) return 'empty';
    return initialSelection
      .map(item => `${item.optionId}-${item.value}-${item.answerType}`)
      .sort()
      .join('|');
  }, [initialSelection]);

  useEffect(() => {
    const parsedRange =
      firstOption && isNumericRangeQuestion
        ? parseNumericRange(firstOption.value)
        : null;
    setNumericRange(parsedRange);
    previousSelectionRef.current = initialSelection
      ? [...initialSelection]
      : [];

    if (allowMultipleChoice || allowSingleChoice) {
      setSelectedChoiceIds(
        (initialSelection ?? []).map(option => option.optionId),
      );
    } else {
      setSelectedChoiceIds([]);
    }

    if (isTimeRangeQuestion) {
      setSelectedSlots((initialSelection ?? []).map(option => option.value));
    } else {
      setSelectedSlots([]);
    }

    if (isDateQuestion) {
      const initialDateValue = initialSelection?.[0]?.value ?? '';
      const parsedInitialDate = initialDateValue
        ? parseSubmissionDateValue(initialDateValue)
        : null;

      if (parsedInitialDate) {
        setSelectedDate(parsedInitialDate);
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let fallbackDate = today;
        if (firstOption) {
          const windowDays = parseDateWindowInDays(firstOption.value);
          const maxDate = new Date(today);
          maxDate.setDate(maxDate.getDate() + windowDays);
          if (fallbackDate > maxDate) {
            fallbackDate = maxDate;
          }
        }

        setSelectedDate(fallbackDate);
      }
    } else {
      setSelectedDate(null);
    }

    if (parsedRange) {
      const numericInitial = initialSelection?.[0]?.value ?? '';
      const parsedNumeric =
        numericInitial.trim() === '' ? Number.NaN : Number(numericInitial);
      if (!Number.isNaN(parsedNumeric)) {
        setNumericSelection(parsedNumeric);
      } else {
        // Check if there's an explicit default value provided
        const hasExplicitDefault =
          (question?.defaultValue !== null &&
            question?.defaultValue !== undefined) ||
          (firstOption?.defaultValue !== null &&
            firstOption?.defaultValue !== undefined);

        if (hasExplicitDefault) {
          const defaultValue = resolveNumericDefault(
            parsedRange,
            question?.defaultValue ?? firstOption?.defaultValue ?? null,
          );
          setNumericSelection(defaultValue);
        } else {
          // Don't set a default value automatically - wait for user interaction
          setNumericSelection(null);
        }
      }
    } else {
      setNumericSelection(null);
    }
  }, [
    question?.id,
    question?.options?.[0]?.id,
    question?.options?.[0]?.value,
    question?.options?.[0]?.defaultValue,
    initialSelectionKey,
    allowMultipleChoice,
    allowSingleChoice,
    isDateQuestion,
    isNumericRangeQuestion,
    isTimeRangeQuestion,
    question?.defaultValue,
  ]);

  useEffect(() => {
    if (!question) {
      const emptySelection: SelectedAnswerOption[] = [];

      if (!areSelectionsEqual(previousSelectionRef.current, emptySelection)) {
        previousSelectionRef.current = emptySelection;
        onSelectionChange(emptySelection);
      }
      ensureSelectionValidity(emptySelection, onValidityChange);
      return;
    }

    let selection: SelectedAnswerOption[] = [];

    if (allowMultipleChoice || allowSingleChoice) {
      selection = selectedChoiceIds
        .map(id => question.options.find(option => option.id === id))
        .filter((option): option is NonNullable<typeof option> =>
          Boolean(option),
        )
        .map(option => ({
          optionId: option.id,
          value: option.value,
          answerType: question.answerType,
          nextVariationId: option.nextVariationId,
        }));
    } else if (
      isNumericRangeQuestion &&
      firstOption &&
      numericRange &&
      numericSelection !== null
    ) {
      selection = [
        {
          optionId: firstOption.id,
          value: `${numericSelection}`,
          answerType: question.answerType,
          nextVariationId: firstOption.nextVariationId,
        },
      ];
    } else if (isTimeRangeQuestion && firstOption) {
      selection = selectedSlots.map(slot => ({
        optionId: firstOption.id,
        value: slot,
        answerType: question.answerType,
        nextVariationId: firstOption.nextVariationId,
      }));
    } else if (isDateQuestion && firstOption && selectedDate) {
      selection = [
        {
          optionId: firstOption.id,
          value: formatDateForSubmission(selectedDate),
          answerType: question.answerType,
          nextVariationId: firstOption.nextVariationId,
        },
      ];
    }

    if (!areSelectionsEqual(previousSelectionRef.current, selection)) {
      previousSelectionRef.current = selection;
      onSelectionChange(selection);
    }

    ensureSelectionValidity(selection, onValidityChange);
  }, [
    allowMultipleChoice,
    allowSingleChoice,
    question?.id,
    question?.answerType,
    question?.options?.[0]?.id,
    question?.options?.[0]?.nextVariationId,
    isDateQuestion,
    isNumericRangeQuestion,
    isTimeRangeQuestion,
    numericRange,
    numericSelection,
    onSelectionChange,
    onValidityChange,
    question?.defaultValue,
    selectedChoiceIds,
    selectedDate,
    selectedSlots,
  ]);

  const dateWindowDays = useMemo(() => {
    if (!isDateQuestion || !firstOption) {
      return 0;
    }
    return parseDateWindowInDays(firstOption.value);
  }, [firstOption, isDateQuestion]);

  const dateBounds = useMemo(() => {
    if (!isDateQuestion) {
      return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limit = new Date(today);
    limit.setDate(limit.getDate() + dateWindowDays);
    return { min: today, max: limit };
  }, [dateWindowDays, isDateQuestion]);

  if (!question) {
    return (
      <View style={styles.container}>
        <AppText tone="secondary">No question to display.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(allowMultipleChoice || allowSingleChoice) && question.options.length ? (
        <AnswerTabs
          options={question.options.map(option => ({
            id: option.id,
            label: option.value,
          }))}
          selectedOptionIds={selectedChoiceIds}
          selectionMode={allowMultipleChoice ? 'multiple' : 'single'}
          variant={'multiple-many'}
          onSelectionChange={setSelectedChoiceIds}
        />
      ) : null}

      {isNumericRangeQuestion && firstOption && numericRange ? (
        <>
          <NumericRangeField
            minimum={numericRange.min}
            maximum={numericRange.max}
            value={
              numericSelection ??
              resolveNumericDefault(
                numericRange,
                question?.defaultValue ?? firstOption.defaultValue ?? null,
              ) ??
              numericRange.min
            }
            units={question.units || ''}
            onValueChange={setNumericSelection}
          />
        </>
      ) : null}

      {isTimeRangeQuestion && firstOption ? (
        <TimeSlotSelector
          range={firstOption.value}
          selectedSlots={selectedSlots}
          onSelectionChange={setSelectedSlots}
        />
      ) : null}

      {isDateQuestion && firstOption && dateBounds ? (
        <DatePickerField
          value={selectedDate}
          minimumDate={dateBounds.min}
          maximumDate={dateBounds.max}
          onChange={setSelectedDate}
        />
      ) : null}

      {!question.options.length && !isNumericRangeQuestion ? (
        <AppText tone="secondary">
          This question does not contain answer options yet.
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
});
