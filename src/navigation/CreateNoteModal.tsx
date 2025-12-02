import React, { useRef } from 'react';
import { ScrollView } from 'react-native';

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
            Reflect, reset, and track your journey. Every entry is a step
            forward.
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
