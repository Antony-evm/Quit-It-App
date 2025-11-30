import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import {
  AppText,
  DraggableModal,
  Box,
  AppPressable,
  ModalActionHeader,
  ScreenHeader,
} from '@/shared/components/ui';
import {
  SPACING,
  COLOR_PALETTE,
  BORDER_RADIUS,
  DEVICE_HEIGHT,
  FOOTER_LAYOUT,
} from '@/shared/theme';
import { TrackingRecordsList } from '@/features/tracking/components/TrackingRecordsList';
import { useCurrentUserId } from '@/features/tracking/hooks/useCurrentUserId';
import {
  NotesCard,
  NotesCardHandle,
} from '@/features/home/components/NotesCard';
import { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import { parseTimestampFromAPI } from '@/utils/timezoneUtils';

export const JournalScreen = () => {
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();

  const [selectedRecord, setSelectedRecord] =
    useState<TrackingRecordApiResponse | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const editCardRef = useRef<NotesCardHandle>(null);
  const editDrawerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const queryKey = ['trackingRecords', 'infinite', currentUserId];
    queryClient.resetQueries({ queryKey });
  }, [queryClient, currentUserId]);

  const handleRecordPress = useCallback((record: TrackingRecordApiResponse) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
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

  const headerContent = useMemo(
    () => (
      <ModalActionHeader
        onClose={() => setIsEditModalVisible(false)}
        onPrimaryAction={() => editCardRef.current?.save()}
        primaryLabel="Save"
      />
    ),
    [],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <ScreenHeader
        title="Your Quit Journal"
        subtitle="A clear view of how far you've come."
        marginBottom={SPACING.md}
      />
    ),
    [],
  );

  return (
    <Box variant="default">
      <TrackingRecordsList
        onRecordPress={handleRecordPress}
        ListHeaderComponent={ListHeaderComponent}
      />

      <DraggableModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        headerContent={headerContent}
      >
        <Box variant="default">
          <ScrollView
            ref={editDrawerScrollRef}
            keyboardShouldPersistTaps="handled"
          >
            <Box>
              <AppText>
                Reflect, reset, and track your journey. Every entry is a step
                forward.
              </AppText>
            </Box>
            {selectedRecord && (
              <NotesCard
                ref={editCardRef}
                recordId={selectedRecord.record_id}
                initialValues={initialValues}
                scrollViewRef={editDrawerScrollRef}
                onSaveSuccess={handleEditSuccess}
                onDeleteSuccess={handleEditSuccess}
              />
            )}
          </ScrollView>
          {selectedRecord && (
            <Box variant="buttonSeparator">
              <AppPressable
                onPress={() => editCardRef.current?.delete()}
                variant="delete"
              >
                <AppText tone="error">Delete</AppText>
              </AppPressable>
            </Box>
          )}
        </Box>
      </DraggableModal>
    </Box>
  );
};
