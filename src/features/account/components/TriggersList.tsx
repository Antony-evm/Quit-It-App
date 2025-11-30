import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard, StatusMessage } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '@/features/questionnaire/components/QuestionnaireQuestion';
import { useTriggersData } from '@/features/questionnaire/hooks/useTriggersData';

export const TriggersList: React.FC = () => {
  const { t } = useTranslation();
  const { question, initialSelection, isLoading, error } = useTriggersData();

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
        onSelectionChange={() => {}}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};
