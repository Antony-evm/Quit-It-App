import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import {
  AppText,
  DraggableModal,
  Box,
  AppPressable,
  ModalActionHeader,
  ScreenHeader,
} from '@/shared/components/ui';
import { TrackingRecordsListContainer } from '@/features/tracking/components/TrackingRecordsList';
import { NotesCard } from '../components/NotesCard';
import { useNotesCardController } from '../hooks/useNotesCardController';
import { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import { parseTimestampFromAPI } from '@/utils/timezoneUtils';

export const JournalScreen = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const editDrawerScrollRef = useRef<ScrollView>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<TrackingRecordApiResponse | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  }, []);

  const initialValues = useMemo(() => {
    if (!selectedRecord) return undefined;
    return {
      trackingTypeId: selectedRecord.tracking_type_id,
      dateTime: parseTimestampFromAPI(selectedRecord.event_at),
      notes: selectedRecord.note || '',
    };
  }, [selectedRecord]);

  const editController = useNotesCardController({
    recordId: selectedRecord?.record_id,
    initialValues,
    scrollViewRef: editDrawerScrollRef,
    onSaveSuccess: handleCloseModal,
    onDeleteSuccess: handleCloseModal,
  });

  useEffect(() => {
    const queryKey = ['trackingRecords', 'infinite'];
    queryClient.resetQueries({ queryKey });
  }, [queryClient]);

  const handleRecordPress = useCallback((record: TrackingRecordApiResponse) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  }, []);

  const headerContent = useMemo(
    () => (
      <ModalActionHeader
        onClose={handleCloseModal}
        onPrimaryAction={editController.save}
        primaryLabel={t('journal.save')}
      />
    ),
    [handleCloseModal, editController.save, t],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <ScreenHeader
        title={t('journal.screenTitle')}
        subtitle={t('journal.screenSubtitle')}
      />
    ),
    [t],
  );

  return (
    <Box variant="default">
      <TrackingRecordsListContainer
        onRecordPress={handleRecordPress}
        ListHeaderComponent={ListHeaderComponent}
      />

      <DraggableModal
        visible={isEditModalVisible}
        onClose={handleCloseModal}
        headerContent={headerContent}
      >
        <Box variant="default">
          <ScrollView
            ref={editDrawerScrollRef}
            keyboardShouldPersistTaps="handled"
          >
            <AppText variant="body">
              {t('journal.editModalDescription')}
            </AppText>
            {selectedRecord && editController.isReady && (
              <NotesCard
                trackingTypes={editController.trackingTypes}
                selectedTrackingTypeId={editController.selectedTrackingTypeId}
                selectedDateTime={editController.selectedDateTime}
                notes={editController.notes}
                maxChars={editController.maxChars}
                accentColor={editController.accentColor}
                isLoading={editController.isLoading}
                onTrackingTypeSelect={editController.onTrackingTypeSelect}
                onDateTimeChange={editController.onDateTimeChange}
                onNotesChange={editController.onNotesChange}
                onNotesFocus={editController.onNotesFocus}
                scrollViewRef={editDrawerScrollRef}
              />
            )}
          </ScrollView>
          {selectedRecord && (
            <Box variant="buttonSeparator">
              <AppPressable onPress={editController.delete} variant="delete">
                <AppText tone="error">{t('journal.delete')}</AppText>
              </AppPressable>
            </Box>
          )}
        </Box>
      </DraggableModal>
    </Box>
  );
};
