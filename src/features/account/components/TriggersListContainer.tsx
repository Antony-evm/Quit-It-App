import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard, Box, StatusMessage } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '@/features/questionnaire/components/QuestionnaireQuestion';
import { useTriggersController } from '../hooks/useTriggersController';
import { TriggersListSkeleton } from './TriggersListSkeleton';

type TriggersListContainerProps = {
  onSaveSuccess: () => void;
  onControllerReady: (controller: {
    canSave: boolean;
    save: () => Promise<void>;
  }) => void;
};

export const TriggersListContainer: React.FC<TriggersListContainerProps> = ({
  onSaveSuccess,
  onControllerReady,
}) => {
  const { t } = useTranslation();

  const controller = useTriggersController({
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
    return <TriggersListSkeleton />;
  }

  if (controller.error) {
    return (
      <AppCard variant="filled" p="zero">
        <StatusMessage type="error" message={t('account.triggers.error')} />
      </AppCard>
    );
  }

  return (
    <Box mt="md">
      <AppCard variant="filled" p="zero">
        <QuestionnaireQuestion
          question={controller.question}
          initialSelection={controller.initialSelection}
          onSelectionChange={controller.onSelectionChange}
          onValidityChange={() => {}}
        />
      </AppCard>
    </Box>
  );
};
