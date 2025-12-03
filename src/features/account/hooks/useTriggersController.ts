import { useState, useCallback, useMemo } from 'react';
import { useTriggersData } from '@/features/questionnaire/hooks/useTriggersData';
import { useSaveTriggers } from '@/features/questionnaire/hooks/useSaveTriggers';
import type { SelectedAnswerOption } from '@/features/questionnaire/types';

type UseTriggersControllerOptions = {
  onSaveSuccess?: () => void;
};

export const useTriggersController = (
  options: UseTriggersControllerOptions = {},
) => {
  const { onSaveSuccess } = options;
  const { question, initialSelection, isLoading, error } = useTriggersData();
  const { saveTriggersAsync, isSaving } = useSaveTriggers();

  const [currentSelection, setCurrentSelection] = useState<
    SelectedAnswerOption[] | null
  >(null);

  const handleSelectionChange = useCallback(
    (selection: SelectedAnswerOption[]) => {
      setCurrentSelection(selection);
    },
    [],
  );

  const hasChanges = useMemo(() => {
    // No changes detected until user interacts
    if (currentSelection === null) {
      return false;
    }
    if (currentSelection.length !== initialSelection.length) {
      return true;
    }
    const currentIds = new Set(currentSelection.map(s => s.optionId));
    const initialIds = new Set(initialSelection.map(s => s.optionId));
    return (
      currentIds.size !== initialIds.size ||
      [...currentIds].some(id => !initialIds.has(id))
    );
  }, [currentSelection, initialSelection]);

  const canSave = useMemo(() => {
    return hasChanges && currentSelection && currentSelection.length > 0;
  }, [hasChanges, currentSelection]);

  const save = useCallback(async () => {
    if (!question || !currentSelection || currentSelection.length === 0) {
      return;
    }
    try {
      await saveTriggersAsync({ question, selection: currentSelection });
      onSaveSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  }, [question, currentSelection, saveTriggersAsync, onSaveSuccess]);

  const reset = useCallback(() => {
    setCurrentSelection(null);
  }, []);

  return {
    // Data
    question,
    initialSelection,
    isLoading,
    error,
    isSaving,
    // State
    hasChanges,
    canSave,
    // Handlers
    onSelectionChange: handleSelectionChange,
    save,
    reset,
  };
};
