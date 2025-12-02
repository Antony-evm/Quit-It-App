import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton, AppCard, Box, StatusMessage } from '@/shared/components/ui';
import { FrequencyGrid } from '@/features/questionnaire/components/FrequencyGrid';
import { useFrequencyData } from '@/features/questionnaire/hooks/useFrequencyData';
import { useSaveFrequency } from '@/features/questionnaire/hooks/useSaveFrequency';
import type {
  SelectedAnswerOption,
  SelectedAnswerSubOption,
} from '@/features/questionnaire/types';

export const FrequencyData: React.FC = () => {
  const { t } = useTranslation();
  const { question, initialSubSelection, isLoading, error } =
    useFrequencyData();
  const { saveFrequency, isSaving } = useSaveFrequency();
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

  const handleSave = useCallback(() => {
    if (!question || !currentMainSelection || !currentSubSelection) {
      return;
    }
    saveFrequency({
      question,
      mainSelection: currentMainSelection,
      subSelection: currentSubSelection,
    });
  }, [question, currentMainSelection, currentSubSelection, saveFrequency]);

  if (isLoading) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage
          type="loading"
          message={t('account.frequency.loading')}
        />
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message={t('account.frequency.error')} />
      </AppCard>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <AppCard variant="filled" p="zero">
      <FrequencyGrid
        options={question.options}
        subOptions={question.subOptions}
        initialSubSelection={initialSubSelection}
        onSubSelectionChange={handleSubSelectionChange}
        onMainSelectionChange={handleMainSelectionChange}
        onValidityChange={() => {}}
      />
      {hasChanges && currentSubSelection && (
        <Box px="lg" pb="lg">
          <AppButton
            label={t('common.save')}
            onPress={handleSave}
            disabled={isSaving || currentSubSelection.length === 0}
            fullWidth
          />
        </Box>
      )}
    </AppCard>
  );
};
