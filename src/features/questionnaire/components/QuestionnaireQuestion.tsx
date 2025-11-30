import React from 'react';

import type { Question, SelectedAnswerOption } from '../types';
import { AppText, Box } from '@/shared/components/ui';
import { AnswerTabs, ANSWER_TAB_VARIANTS } from './inputs';
import { DatePickerField } from './inputs';
import { NumericRangeField } from './inputs';
import { useQuestionnaireQuestion } from '../hooks/useQuestionnaireQuestion';
import { resolveNumericDefault } from '../utils/questionLogic';

type QuestionnaireQuestionProps = {
  question: Question | null;
  initialSelection?: SelectedAnswerOption[];
  onSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

export const QuestionnaireQuestion = ({
  question,
  initialSelection,
  onSelectionChange,
  onValidityChange,
}: QuestionnaireQuestionProps) => {
  const {
    selectedChoiceIds,
    setSelectedChoiceIds,
    numericRange,
    numericSelection,
    setNumericSelection,
    selectedDate,
    setSelectedDate,
    allowMultipleChoice,
    allowSingleChoice,
    isNumericRangeQuestion,
    isDateQuestion,
    firstOption,
    dateBounds,
  } = useQuestionnaireQuestion({
    question,
    initialSelection,
    onSelectionChange,
    onValidityChange,
  });

  if (!question) {
    return (
      <Box>
        <AppText tone="secondary">No question to display.</AppText>
      </Box>
    );
  }

  return (
    <Box>
      {(allowMultipleChoice || allowSingleChoice) && question.options.length ? (
        <AnswerTabs
          options={question.options.map(option => ({
            id: option.id,
            label: option.value,
          }))}
          selectedOptionIds={selectedChoiceIds}
          selectionMode={allowMultipleChoice ? 'multiple' : 'single'}
          variant={ANSWER_TAB_VARIANTS.MULTIPLE_MANY}
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
    </Box>
  );
};
