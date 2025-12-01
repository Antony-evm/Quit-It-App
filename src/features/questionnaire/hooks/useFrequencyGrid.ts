import { useCallback, useEffect, useMemo, useState } from 'react';
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

export const useFrequencyGrid = ({
  options,
  subOptions,
  initialSubSelection = [],
  onSubSelectionChange,
  onMainSelectionChange,
  onValidityChange,
}: UseFrequencyGridProps) => {
  const [selections, setSelections] = useState<Record<number, number>>({});

  const subOptionsMap = useMemo(
    () => new Map(subOptions.map(so => [so.id, so])),
    [subOptions],
  );

  const orderedSubOptions = useMemo(() => {
    return [...subOptions].sort((a, b) => {
      const aIndex = FREQUENCY_ORDER.indexOf(normalizeFrequencyValue(a.value));
      const bIndex = FREQUENCY_ORDER.indexOf(normalizeFrequencyValue(b.value));
      const aPriority = aIndex === -1 ? Infinity : aIndex;
      const bPriority = bIndex === -1 ? Infinity : bIndex;
      return aPriority - bPriority;
    });
  }, [subOptions]);

  // Parse time windows from main options (which contain time periods like "Early Morning (6AM - 9AM)")
  const enrichedMainOptions = useMemo(
    () =>
      options.map(option => ({
        ...option,
        ...parseTimeWindow(option.value),
      })),
    [options],
  );

  useEffect(() => {
    const initialSelections = Object.fromEntries(
      initialSubSelection
        .filter(sub => sub.mainOptionId !== undefined)
        .map(sub => [sub.mainOptionId, sub.optionId]),
    );
    setSelections(initialSelections);
  }, [initialSubSelection]);

  useEffect(() => {
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

  useEffect(() => {
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
