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

  const orderedSubOptions = useMemo(() => {
    const withPriority = subOptions.map((subOption, index) => {
      const priority = FREQUENCY_ORDER.indexOf(
        normalizeFrequencyValue(subOption.value),
      );

      return {
        subOption,
        priority: priority === -1 ? FREQUENCY_ORDER.length + index : priority,
      };
    });

    return withPriority
      .sort((a, b) => a.priority - b.priority)
      .map(item => item.subOption);
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
    const initialSelections: Record<number, number> = {};

    initialSubSelection.forEach(subSelection => {
      if (subSelection.mainOptionId !== undefined) {
        initialSelections[subSelection.mainOptionId] = subSelection.optionId;
      }
    });

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
    const selectedSubOptions = Object.entries(selections)
      .map(([optionId, subOptionId]) => {
        const subOption = subOptions.find(so => so.id === subOptionId);
        if (!subOption) return null;

        return {
          optionId: subOptionId,
          value: subOption.value,
          answerType: 'multiple_choice' as AnswerType,
          combination: subOption.combination,
          mainOptionId: parseInt(optionId), // Include the main option ID for pairing
        };
      })
      .filter(item => item !== null) as SelectedAnswerSubOption[];

    onSubSelectionChange(selectedSubOptions);
    const isValid =
      options.length > 0 &&
      options.every(option => selections[option.id] !== undefined);

    onValidityChange?.(isValid);
  }, [selections, options, subOptions, onSubSelectionChange, onValidityChange]);

  return {
    selections,
    orderedSubOptions,
    enrichedMainOptions,
    handleSelectionChange,
  };
};
