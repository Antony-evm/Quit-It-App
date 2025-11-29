import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import {
  AppText,
  DraggableModal,
  Box,
  AppPressable,
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
import CancelIcon from '@/assets/cancel.svg';
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
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <AppPressable
          onPress={() => setIsEditModalVisible(false)}
          variant="icon"
          hitSlop={10}
        >
          <CancelIcon
            width={24}
            height={24}
            color={COLOR_PALETTE.textPrimary}
          />
        </AppPressable>

        <AppPressable
          onPress={() => editCardRef.current?.save()}
          variant="icon"
          hitSlop={10}
        >
          <AppText variant="body" style={styles.saveButtonText}>
            Save
          </AppText>
        </AppPressable>
      </Box>
    ),
    [],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <Box mb="sm">
        <AppText variant="title" style={styles.title}>
          Your Quit Journal
        </AppText>
        <AppText tone="primary">A clear view of how far you've come.</AppText>
      </Box>
    ),
    [],
  );

  return (
    <Box flex={1}>
      <TrackingRecordsList
        onRecordPress={handleRecordPress}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.scrollContent}
      />

      <DraggableModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        headerContent={headerContent}
      >
        <Box flex={1} justifyContent="space-between">
          <ScrollView
            ref={editDrawerScrollRef}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <Box mb="xl" mt="md" px="sm">
              <AppText
                variant="body"
                tone="primary"
                style={styles.modalDescription}
              >
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
            <Box
              p="md"
              pb="xs"
              bg="backgroundMuted"
              alignItems="center"
              style={styles.deleteButtonContainer}
            >
              <AppPressable
                onPress={() => editCardRef.current?.delete()}
                style={styles.deleteButton}
              >
                <AppText style={styles.deleteButtonText}>Delete</AppText>
              </AppPressable>
            </Box>
          )}
        </Box>
      </DraggableModal>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    marginTop: DEVICE_HEIGHT * 0.05,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl + FOOTER_LAYOUT.FAB_SIZE / 2,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  saveButtonText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 18,
  },
  deleteButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.borderDefault,
  },
  deleteButton: {
    backgroundColor: COLOR_PALETTE.backgroundDark,
    borderWidth: 0,
    borderRadius: BORDER_RADIUS.medium,
    width: '50%',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: COLOR_PALETTE.systemError,
    fontWeight: '600',
    fontSize: 18,
  },
});
