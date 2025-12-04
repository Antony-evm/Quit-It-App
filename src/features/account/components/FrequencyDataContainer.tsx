import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard, StatusMessage } from '@/shared/components/ui';
import { FrequencyGrid } from '@/features/questionnaire/components/FrequencyGrid';
import { useFrequencyController } from '../hooks/useFrequencyController';
import { FrequencyDataSkeleton } from './FrequencyDataSkeleton';

type FrequencyDataContainerProps = {
  onSaveSuccess: () => void;
  onControllerReady: (controller: {
    canSave: boolean;
    save: () => Promise<void>;
  }) => void;
};

export const FrequencyDataContainer: React.FC<FrequencyDataContainerProps> = ({
  onSaveSuccess,
  onControllerReady,
}) => {
  const { t } = useTranslation();

  const controller = useFrequencyController({
    onSaveSuccess,
  });

  // Notify parent of controller state changes
  React.useEffect(() => {
    onControllerReady({
      canSave: controller.canSave ?? false,
      save: controller.save,
    });
  }, [controller.canSave, controller.save, onControllerReady]);

  if (controller.isLoading) {
    return <FrequencyDataSkeleton />;
  }

  if (controller.error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message={t('account.frequency.error')} />
      </AppCard>
    );
  }

  if (!controller.question) {
    return null;
  }

  return (
    <AppCard variant="filled" p="zero">
      <FrequencyGrid
        options={controller.question.options}
        subOptions={controller.question.subOptions}
        initialSubSelection={controller.initialSubSelection}
        onSubSelectionChange={controller.onSubSelectionChange}
        onMainSelectionChange={controller.onMainSelectionChange}
        onValidityChange={() => {}}
      />
    </AppCard>
  );
};
