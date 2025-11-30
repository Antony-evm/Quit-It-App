import type { QuestionnaireResponseRecord } from '../types';
import {
  formatDisplayDate,
  getRelativeDateInfo,
  parseSubmissionDateValue,
} from './dateFormatting';

export type AnswerDisplay = {
  primary: string;
  secondary?: string;
};

export const resolveAnswerDisplay = (
  response: QuestionnaireResponseRecord,
): AnswerDisplay => {
  if (!response.answerOptions.length) {
    return {
      primary: 'No answer selected',
    };
  }

  if (response.answerType === 'date') {
    const first = response.answerOptions[0];
    const parsed = parseSubmissionDateValue(first?.answer_value ?? '');

    if (parsed) {
      return {
        primary: formatDisplayDate(parsed),
        secondary: getRelativeDateInfo(parsed) || undefined,
      };
    }
  }

  const combinedValues = response.answerOptions
    .map(option => {
      const mainValue = option.answer_value.trim();
      if (!mainValue) return null;

      const subValue = option.answer_sub_option_value?.trim();

      if (subValue) {
        let formattedSubValue = subValue;
        if (option.answer_sub_option_type === 'date') {
          const parsed = parseSubmissionDateValue(subValue);
          formattedSubValue = parsed ? formatDisplayDate(parsed) : subValue;
        }

        return `${mainValue} - ${formattedSubValue}`;
      }

      return mainValue;
    })
    .filter(value => value !== null) as string[];

  if (!combinedValues.length) {
    return {
      primary: 'No answer selected',
    };
  }

  // Join multiple values with line breaks
  const primary = combinedValues.join('\n');

  return {
    primary,
  };
};
