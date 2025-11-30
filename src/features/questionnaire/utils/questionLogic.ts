import type { SelectedAnswerOption } from '../types';

export const parseNumericRange = (value: string) => {
  const [minRaw, maxRaw] = value.split('-').map(part => Number(part.trim()));

  if (Number.isNaN(minRaw) || Number.isNaN(maxRaw)) {
    return null;
  }

  const min = Math.min(minRaw, maxRaw);
  const max = Math.max(minRaw, maxRaw);

  return { min, max };
};

export const resolveNumericDefault = (
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

export const parseDateWindowInDays = (value: string) => {
  const numeric = parseInt(value, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
};

export const areSelectionsEqual = (
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
