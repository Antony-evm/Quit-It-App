import { useState, useCallback, useMemo } from 'react';
import { useFrequencyData } from '@/features/questionnaire/hooks/useFrequencyData';
import { useSaveFrequency } from '@/features/questionnaire/hooks/useSaveFrequency';
import type {
  SelectedAnswerOption,
  SelectedAnswerSubOption,
} from '@/features/questionnaire/types';

type UseFrequencyControllerOptions = {
  onSaveSuccess?: () => void;
};

export const useFrequencyController = (
  options: UseFrequencyControllerOptions = {},
) => {
  const { onSaveSuccess } = options;
  const { question, initialSubSelection, isLoading, error } =
    useFrequencyData();
  const { saveFrequencyAsync, isSaving } = useSaveFrequency();

  const [currentMainSelection, setCurrentMainSelection] = useState<
    SelectedAnswerOption[] | null
  >(null);
  const [currentSubSelection, setCurrentSubSelection] = useState<
    SelectedAnswerSubOption[] | null
  >(null);

  const handleMainSelectionChange = useCallback(
    (selection: SelectedAnswerOption[]) => {
      setCurrentMainSelection(selection);
    },
    [],
  );

  const handleSubSelectionChange = useCallback(
    (selection: SelectedAnswerSubOption[]) => {
      setCurrentSubSelection(selection);
    },
    [],
  );

  const hasChanges = useMemo(() => {
    // No changes detected until user interacts
    if (currentSubSelection === null) {
      return false;
    }
    if (currentSubSelection.length !== initialSubSelection.length) {
      return true;
    }
    // Compare sub-selections by mainOptionId and optionId pairs
    const currentMap = new Map(
      currentSubSelection.map(s => [s.mainOptionId, s.optionId]),
    );
    const initialMap = new Map(
      initialSubSelection.map(s => [s.mainOptionId, s.optionId]),
    );

    if (currentMap.size !== initialMap.size) {
      return true;
    }

    for (const [mainId, subId] of currentMap) {
      if (initialMap.get(mainId) !== subId) {
        return true;
      }
    }

    return false;
  }, [currentSubSelection, initialSubSelection]);

  const canSave = useMemo(() => {
    return hasChanges && currentSubSelection && currentSubSelection.length > 0;
  }, [hasChanges, currentSubSelection]);

  const save = useCallback(async () => {
    if (!question || !currentMainSelection || !currentSubSelection) {
      return;
    }
    try {
      await saveFrequencyAsync({
        question,
        mainSelection: currentMainSelection,
        subSelection: currentSubSelection,
      });
      onSaveSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  }, [
    question,
    currentMainSelection,
    currentSubSelection,
    saveFrequencyAsync,
    onSaveSuccess,
  ]);

  const reset = useCallback(() => {
    setCurrentMainSelection(null);
    setCurrentSubSelection(null);
  }, []);

  return {
    // Data
    question,
    initialSubSelection,
    isLoading,
    error,
    isSaving,
    // State
    hasChanges,
    canSave,
    // Handlers
    onMainSelectionChange: handleMainSelectionChange,
    onSubSelectionChange: handleSubSelectionChange,
    save,
    reset,
  };
};
