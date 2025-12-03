import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard, StatusMessage } from '@/shared/components/ui';
import { FrequencyGrid } from '@/features/questionnaire/components/FrequencyGrid';
import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
} from '@/features/questionnaire/types';

type FrequencyDataProps = {
  question: {
    options: AnswerOption[];
    subOptions: AnswerSubOption[];
  } | null;
  initialSubSelection: SelectedAnswerSubOption[];
  isLoading: boolean;
  error: string | null;
  onMainSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onSubSelectionChange: (selection: SelectedAnswerSubOption[]) => void;
};

export const FrequencyData: React.FC<FrequencyDataProps> = ({
  question,
  initialSubSelection,
  isLoading,
  error,
  onMainSelectionChange,
  onSubSelectionChange,
}) => {
  const { t } = useTranslation();

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
        onSubSelectionChange={onSubSelectionChange}
        onMainSelectionChange={onMainSelectionChange}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};
