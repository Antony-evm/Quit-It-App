import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Question, SelectedAnswerOption } from '../types';
import { AppText } from '../../../shared/components/ui';
import { AnswerTabs } from './controls/AnswerTabs';
import { DatePickerField } from './fields/DatePickerField';
import { NumericRangeField } from './fields/NumericRangeField';
import { TimeSlotSelector } from './fields/TimeSlotSelector';
import { SPACING } from '../../../shared/theme';

type QuestionnaireQuestionProps = {
  question: Question | null;
  onSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

const parseNumericRange = (value: string) => {
  const [minRaw, maxRaw] = value.split('-').map((part) => Number(part.trim()));

  if (Number.isNaN(minRaw) || Number.isNaN(maxRaw)) {
    return null;
  }

  const min = Math.min(minRaw, maxRaw);
  const max = Math.max(minRaw, maxRaw);

  return { min, max };
};

const parseDateWindowInDays = (value: string) => {
  const numeric = parseInt(value, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const formatDateForSubmission = (date: Date) => {
  const utc = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const iso = utc.toISOString().split('.')[0];
  return `${iso.replace('T', ' ')}+00:00`;
};

const ensureSelectionValidity = (
  selection: SelectedAnswerOption[],
  onValidityChange?: (isValid: boolean) => void,
) => {
  onValidityChange?.(selection.length > 0);
};

export const QuestionnaireQuestion = ({
  question,
  onSelectionChange,
  onValidityChange,
}: QuestionnaireQuestionProps) => {
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<number[]>([]);
  const [numericRange, setNumericRange] = useState<{ min: number; max: number } | null>(
    null,
  );
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

  useEffect(() => {
    setSelectedChoiceIds([]);
    setSelectedSlots([]);
    setSelectedDate(null);
    const parsedRange =
      firstOption && isNumericRangeQuestion
        ? parseNumericRange(firstOption.value)
        : null;
    setNumericRange(parsedRange);
    if (parsedRange) {
      const defaultValue =
        parsedRange.min + Math.floor((parsedRange.max - parsedRange.min) / 2);
      setNumericSelection(defaultValue);
    } else {
      setNumericSelection(null);
    }
    onSelectionChange([]);
    onValidityChange?.(false);
  }, [
    firstOption,
    isNumericRangeQuestion,
    onSelectionChange,
    onValidityChange,
  ]);

  useEffect(() => {
    if (!question) {
      onSelectionChange([]);
      onValidityChange?.(false);
      return;
    }

    let selection: SelectedAnswerOption[] = [];

    if (allowMultipleChoice || allowSingleChoice) {
      selection = selectedChoiceIds
        .map((id) => question.options.find((option) => option.id === id))
        .filter((option): option is NonNullable<typeof option> => Boolean(option))
        .map((option) => ({
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
      selection = selectedSlots.map((slot) => ({
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

    onSelectionChange(selection);
    ensureSelectionValidity(selection, onValidityChange);
  }, [
    allowMultipleChoice,
    allowSingleChoice,
    firstOption,
    isDateQuestion,
    isNumericRangeQuestion,
    isTimeRangeQuestion,
    numericRange,
    numericSelection,
    onSelectionChange,
    onValidityChange,
    question,
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

  const minimumSelectableDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, [question?.id]);

  const maximumSelectableDate = useMemo(() => {
    const limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setDate(limit.getDate() + dateWindowDays);
    return limit;
  }, [dateWindowDays, question?.id]);

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
          options={question.options.map((option) => ({
            id: option.id,
            label: option.value,
          }))}
          selectedOptionIds={selectedChoiceIds}
          selectionMode={allowMultipleChoice ? 'multiple' : 'single'}
          onSelectionChange={setSelectedChoiceIds}
        />
      ) : null}

      {isNumericRangeQuestion && firstOption && numericRange ? (
        <NumericRangeField
          minimum={numericRange.min}
          maximum={numericRange.max}
          value={
            numericSelection ??
            numericRange.min +
              Math.floor((numericRange.max - numericRange.min) / 2)
          }
          onValueChange={setNumericSelection}
        />
      ) : null}

      {isTimeRangeQuestion && firstOption ? (
        <TimeSlotSelector
          range={firstOption.value}
          selectedSlots={selectedSlots}
          onSelectionChange={setSelectedSlots}
        />
      ) : null}

      {isDateQuestion && firstOption ? (
        <DatePickerField
          value={selectedDate}
          minimumDate={minimumSelectableDate}
          maximumDate={maximumSelectableDate}
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
