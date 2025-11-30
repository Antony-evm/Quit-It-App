import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard, StatusMessage } from '@/shared/components/ui';
import { FrequencyGrid } from '@/features/questionnaire/components/FrequencyGrid';
import { useFrequencyData } from '@/features/questionnaire/hooks/useFrequencyData';

export const FrequencyData: React.FC = () => {
  const { t } = useTranslation();
  const { question, initialSubSelection, isLoading, error } =
    useFrequencyData();

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
        onSubSelectionChange={() => {}}
        onMainSelectionChange={() => {}}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};
