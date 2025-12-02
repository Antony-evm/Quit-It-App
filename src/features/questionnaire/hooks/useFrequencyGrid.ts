import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
  AnswerType,
} from '../types';
import { parseTimeWindow } from '../utils/timeUtils';

const FREQUENCY_ORDER = ['never', 'rarely', 'often', 'constantly'];

const normalizeFrequencyValue = (value: string) => value.trim().toLowerCase();

type UseFrequencyGridProps = {
  options: AnswerOption[];
  subOptions: AnswerSubOption[];
  initialSubSelection?: SelectedAnswerSubOption[];
  onSubSelectionChange: (selection: SelectedAnswerSubOption[]) => void;
  onMainSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

// Helper to compute ordered sub-options (used for both initialization and memoization)
const computeOrderedSubOptions = (subOptions: AnswerSubOption[]) => {
  return [...subOptions].sort((a, b) => {
    const aIndex = FREQUENCY_ORDER.indexOf(normalizeFrequencyValue(a.value));
    const bIndex = FREQUENCY_ORDER.indexOf(normalizeFrequencyValue(b.value));
    const aPriority = aIndex === -1 ? Infinity : aIndex;
    const bPriority = bIndex === -1 ? Infinity : bIndex;
    return aPriority - bPriority;
  });
};

// Helper to compute initial selections
const computeInitialSelections = (
  options: AnswerOption[],
  subOptions: AnswerSubOption[],
  initialSubSelection: SelectedAnswerSubOption[],
): Record<number, number> => {
  // Filter initial selections to ensure they belong to the current options
  // This prevents stale state from previous questions from polluting the new grid
  const validOptionIds = new Set(options.map(o => o.id));
  const validInitialSelections = initialSubSelection.filter(
    sub =>
      sub.mainOptionId !== undefined && validOptionIds.has(sub.mainOptionId),
  );

  // If we have valid initial sub-selection, use that
  if (validInitialSelections.length > 0) {
    return Object.fromEntries(
      validInitialSelections.map(sub => [sub.mainOptionId, sub.optionId]),
    );
  }

  // Otherwise, initialize all options with the first sub-option (slider default at index 0)
  if (options.length > 0 && subOptions.length > 0) {
    const ordered = computeOrderedSubOptions(subOptions);
    return Object.fromEntries(
      options.map(option => [option.id, ordered[0].id]),
    );
  }

  return {};
};

export const useFrequencyGrid = ({
  options,
  subOptions,
  initialSubSelection = [],
  onSubSelectionChange,
  onMainSelectionChange,
  onValidityChange,
}: UseFrequencyGridProps) => {
  const subOptionsMap = useMemo(
    () => new Map(subOptions.map(so => [so.id, so])),
    [subOptions],
  );

  const orderedSubOptions = useMemo(
    () => computeOrderedSubOptions(subOptions),
    [subOptions],
  );

  // Initialize selections synchronously to avoid race condition with effects
  const [selections, setSelections] = useState<Record<number, number>>(() =>
    computeInitialSelections(options, subOptions, initialSubSelection),
  );

  // Parse time windows from main options (which contain time periods like "Early Morning (6AM - 9AM)")
  const enrichedMainOptions = useMemo(
    () =>
      options.map(option => ({
        ...option,
        ...parseTimeWindow(option.value),
      })),
    [options],
  );

  // Update selections if props change after initial mount
  useEffect(() => {
    const newSelections = computeInitialSelections(
      options,
      subOptions,
      initialSubSelection,
    );
    setSelections(newSelections);
  }, [initialSubSelection, options, subOptions]);

  // Report main options to parent
  useLayoutEffect(() => {
    if (options.length > 0) {
      const allMainOptions: SelectedAnswerOption[] = options.map(option => ({
        optionId: option.id,
        value: option.value,
        answerType: 'multiple_choice' as AnswerType,
        nextVariationId: option.nextVariationId,
      }));

      onMainSelectionChange(allMainOptions);
    }
  }, [options, onMainSelectionChange]);

  const handleSelectionChange = useCallback(
    (optionId: number, sliderIndex: number) => {
      const subOption = orderedSubOptions[sliderIndex];
      if (!subOption) {
        return;
      }

      setSelections(prev => ({
        ...prev,
        [optionId]: subOption.id,
      }));
    },
    [orderedSubOptions],
  );

  // Report sub-options and validity to parent - use useLayoutEffect for synchronous update
  useLayoutEffect(() => {
    const selectedSubOptions = Object.entries(selections).flatMap(
      ([optionId, subOptionId]): SelectedAnswerSubOption[] => {
        const subOption = subOptionsMap.get(subOptionId);
        if (!subOption) return [];

        return [
          {
            optionId: subOptionId,
            value: subOption.value,
            answerType: 'multiple_choice' as AnswerType,
            combination: subOption.combination,
            mainOptionId: Number(optionId),
          },
        ];
      },
    );

    onSubSelectionChange(selectedSubOptions);

    const isValid =
      options.length > 0 &&
      options.every(option => selections[option.id] !== undefined);

    onValidityChange?.(isValid);
  }, [
    selections,
    options,
    subOptionsMap,
    onSubSelectionChange,
    onValidityChange,
  ]);

  return {
    selections,
    orderedSubOptions,
    enrichedMainOptions,
    handleSelectionChange,
  };
};
