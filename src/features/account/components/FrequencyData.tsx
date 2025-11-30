import React from 'react';
import { AppCard, StatusMessage } from '@/shared/components/ui';
import { FrequencyGrid } from '@/features/questionnaire/components/FrequencyGrid';
import { useFrequencyData } from '@/features/questionnaire/hooks/useFrequencyData';

export const FrequencyData: React.FC = () => {
  const { question, initialSubSelection, isLoading, error } =
    useFrequencyData();

  if (isLoading) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="loading" message="Loading frequency data..." />
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message="Unable to load frequency data" />
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
