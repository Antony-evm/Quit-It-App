import React from 'react';
import { AppCard, StatusMessage } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '@/features/questionnaire/components/QuestionnaireQuestion';
import { useTriggersData } from '@/features/questionnaire/hooks/useTriggersData';

export const TriggersList: React.FC = () => {
  const { question, initialSelection, isLoading, error } = useTriggersData();

  if (isLoading) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="loading" message="Loading triggers..." />
      </AppCard>
    );
  }

  if (error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message="Unable to load triggers" />
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
