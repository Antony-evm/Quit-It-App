import { useEffect, useMemo, useRef, useState } from 'react';
import type { Question, SelectedAnswerOption } from '../types';
import {
  parseNumericRange,
  resolveNumericDefault,
  parseDateWindowInDays,
  areSelectionsEqual,
} from '../utils/questionLogic';
import {
  formatDateForSubmission,
  parseSubmissionDateValue,
} from '../utils/dateFormatting';

type UseQuestionnaireQuestionProps = {
  question: Question | null;
  initialSelection?: SelectedAnswerOption[];
  onSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

export const useQuestionnaireQuestion = ({
  question,
  initialSelection,
  onSelectionChange,
  onValidityChange,
}: UseQuestionnaireQuestionProps) => {
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
    question?.options,
    question?.defaultValue,
    initialSelectionKey,
    allowMultipleChoice,
    allowSingleChoice,
    isDateQuestion,
    isNumericRangeQuestion,
    isTimeRangeQuestion,
    firstOption,
    initialSelection,
  ]);

  useEffect(() => {
    if (!question) {
      const emptySelection: SelectedAnswerOption[] = [];

      if (!areSelectionsEqual(previousSelectionRef.current, emptySelection)) {
        previousSelectionRef.current = emptySelection;
        onSelectionChange(emptySelection);
      }
      onValidityChange?.(false);
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

    onValidityChange?.(selection.length > 0);
  }, [
    allowMultipleChoice,
    allowSingleChoice,
    question,
    isDateQuestion,
    isNumericRangeQuestion,
    isTimeRangeQuestion,
    numericRange,
    numericSelection,
    onSelectionChange,
    onValidityChange,
    selectedChoiceIds,
    selectedDate,
    selectedSlots,
    firstOption,
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

  return {
    selectedChoiceIds,
    setSelectedChoiceIds,
    numericRange,
    numericSelection,
    setNumericSelection,
    selectedSlots,
    setSelectedSlots,
    selectedDate,
    setSelectedDate,
    allowMultipleChoice,
    allowSingleChoice,
    isNumericRangeQuestion,
    isTimeRangeQuestion,
    isDateQuestion,
    firstOption,
    dateBounds,
  };
};
