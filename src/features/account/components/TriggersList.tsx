import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton, AppCard, Box, StatusMessage } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '@/features/questionnaire/components/QuestionnaireQuestion';
import { useTriggersData } from '@/features/questionnaire/hooks/useTriggersData';
import { useSaveTriggers } from '@/features/questionnaire/hooks/useSaveTriggers';
import type { SelectedAnswerOption } from '@/features/questionnaire/types';

export const TriggersList: React.FC = () => {
  const { t } = useTranslation();
  const { question, initialSelection, isLoading, error } = useTriggersData();
  const { saveTriggers, isSaving } = useSaveTriggers();
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

  const handleSave = useCallback(() => {
    if (!question || !currentSelection || currentSelection.length === 0) {
      return;
    }
    saveTriggers({ question, selection: currentSelection });
  }, [question, currentSelection, saveTriggers]);

  if (isLoading) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="loading" message={t('account.triggers.loading')} />
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message={t('account.triggers.error')} />
      </AppCard>
    );
  }

  return (
    <AppCard variant="filled" p="zero">
      <QuestionnaireQuestion
        question={question}
        initialSelection={initialSelection}
        onSelectionChange={handleSelectionChange}
        onValidityChange={() => {}}
      />
      {hasChanges && currentSelection && (
        <Box px="lg" pb="lg">
          <AppButton
            label={t('common.save')}
            onPress={handleSave}
            disabled={isSaving || currentSelection.length === 0}
            fullWidth
          />
        </Box>
      )}
    </AppCard>
  );
};
