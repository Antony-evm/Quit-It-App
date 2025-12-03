import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard, StatusMessage } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '@/features/questionnaire/components/QuestionnaireQuestion';
import type {
  Question,
  SelectedAnswerOption,
} from '@/features/questionnaire/types';

type TriggersListProps = {
  question: Question | null;
  initialSelection: SelectedAnswerOption[];
  isLoading: boolean;
  error: string | null;
  onSelectionChange: (selection: SelectedAnswerOption[]) => void;
};

export const TriggersList: React.FC<TriggersListProps> = ({
  question,
  initialSelection,
  isLoading,
  error,
  onSelectionChange,
}) => {
  const { t } = useTranslation();

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
        onSelectionChange={onSelectionChange}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};
