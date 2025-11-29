import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { AppText, DraggableModal } from '@/shared/components/ui';
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
      <View style={styles.modalHeaderContent}>
        <Pressable
          onPress={() => setIsEditModalVisible(false)}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && { opacity: 0.7 },
          ]}
          hitSlop={10}
        >
          <CancelIcon
            width={24}
            height={24}
            color={COLOR_PALETTE.textPrimary}
          />
        </Pressable>

        <Pressable
          onPress={() => editCardRef.current?.save()}
          style={styles.headerButton}
          hitSlop={10}
        >
          {({ pressed }) => (
            <AppText
              variant="body"
              style={[styles.saveButtonText, pressed && { opacity: 0.7 }]}
            >
              Save
            </AppText>
          )}
        </Pressable>
      </View>
    ),
    [],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <AppText variant="title" style={styles.title}>
          Your Quit Journal
        </AppText>
        <AppText tone="primary">A clear view of how far you've come.</AppText>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
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
        <View style={styles.modalInnerContainer}>
          <ScrollView
            ref={editDrawerScrollRef}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalTextContainer}>
              <AppText
                variant="body"
                tone="primary"
                style={styles.modalDescription}
              >
                Reflect, reset, and track your journey. Every entry is a step
                forward.
              </AppText>
            </View>
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
            <View style={styles.deleteButtonContainer}>
              <Pressable
                onPress={() => editCardRef.current?.delete()}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <AppText style={styles.deleteButtonText}>Delete</AppText>
              </Pressable>
            </View>
          )}
        </View>
      </DraggableModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: DEVICE_HEIGHT * 0.05,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl + FOOTER_LAYOUT.FAB_SIZE / 2, // Add extra padding for FAB overlap
  },
  header: {
    marginBottom: SPACING.sm,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.xs,
  },
  saveButtonText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalInnerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalTextContainer: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 18,
  },
  deleteButtonContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    alignItems: 'center',
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
