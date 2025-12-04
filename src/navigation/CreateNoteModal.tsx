import { useRef } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  AppText,
  Box,
  DraggableModal,
  ModalActionHeader,
} from '@/shared/components/ui';
import { NotesCard } from '@/features/journal/components/NotesCard';
import { useNotesCardController } from '@/features/journal/hooks/useNotesCardController';
import { SPACING } from '@/shared/theme';

type CreateNoteModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const CreateNoteModal = ({ visible, onClose }: CreateNoteModalProps) => {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const controller = useNotesCardController({
    scrollViewRef: scrollRef,
    onSaveSuccess: onClose,
  });

  const renderHeaderContent = () => (
    <ModalActionHeader
      onClose={onClose}
      onPrimaryAction={controller.save}
      primaryLabel="Save"
      title={t('journal.createModalTitle')}
    />
  );

  return (
    <DraggableModal
      visible={visible}
      onClose={onClose}
      headerContent={renderHeaderContent()}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: SPACING.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <Box variant="modalTextContainer">
          <AppText variant="body" tone="primary" centered>
            {t('journal.editModalDescription')}
          </AppText>
        </Box>
        {controller.isReady && (
          <NotesCard
            trackingTypes={controller.trackingTypes}
            selectedTrackingTypeId={controller.selectedTrackingTypeId}
            selectedDateTime={controller.selectedDateTime}
            notes={controller.notes}
            maxChars={controller.maxChars}
            accentColor={controller.accentColor}
            isLoading={controller.isLoading}
            onTrackingTypeSelect={controller.onTrackingTypeSelect}
            onDateTimeChange={controller.onDateTimeChange}
            onNotesChange={controller.onNotesChange}
            onNotesFocus={controller.onNotesFocus}
            scrollViewRef={scrollRef}
          />
        )}
      </ScrollView>
    </DraggableModal>
  );
};
