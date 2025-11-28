import React, { useEffect, useRef, useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { AppText, DraggableModal, AppButton } from '@/shared/components/ui';
import {
  SPACING,
  COLOR_PALETTE,
  BRAND_COLORS,
  BORDER_RADIUS,
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
  const scrollViewRef = useRef<ScrollView>(null);
  const currentUserId = useCurrentUserId();

  const [selectedRecord, setSelectedRecord] =
    useState<TrackingRecordApiResponse | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const editCardRef = useRef<NotesCardHandle>(null);
  const editDrawerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const queryKey = ['trackingRecords', 'infinite', currentUserId];
    queryClient.resetQueries({ queryKey });
  }, [queryClient, currentUserId]);

  const handleRecordPress = (record: TrackingRecordApiResponse) => {
    setSelectedRecord(record);
    setIsDirty(false);
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
    setIsDirty(false);
  };

  const initialValues = useMemo(() => {
    if (!selectedRecord) return undefined;
    return {
      trackingTypeId: selectedRecord.tracking_type_id,
      dateTime: parseTimestampFromAPI(selectedRecord.event_at),
      notes: selectedRecord.note || '',
    };
  }, [selectedRecord]);

  const renderHeaderContent = () => (
    <View style={styles.modalHeaderContent}>
      <Pressable
        onPress={() => setIsEditModalVisible(false)}
        style={({ pressed }) => [
          styles.headerButton,
          pressed && { opacity: 0.7 },
        ]}
        hitSlop={10}
      >
        <CancelIcon width={24} height={24} color={BRAND_COLORS.cream} />
      </Pressable>

      {isDirty && (
        <Pressable
          onPress={() => editCardRef.current?.save()}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && { opacity: 0.7 },
          ]}
          hitSlop={10}
        >
          <AppText variant="body" style={styles.saveButtonText}>
            Save
          </AppText>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="title" style={styles.title}>
            Your Quit Journal
          </AppText>
          <AppText tone="primary">
            Reflect, reset, and strengthen the smoke-free version of you.
            Logging cravings shows you how far you've come and what strengthens
            you.
          </AppText>
        </View>
        <TrackingRecordsList
          scrollViewRef={scrollViewRef}
          onRecordPress={handleRecordPress}
        />
      </ScrollView>

      <DraggableModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        headerContent={renderHeaderContent()}
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
                onDirtyChange={setIsDirty}
              />
            )}
          </ScrollView>
          {selectedRecord && (
            <View style={styles.deleteButtonContainer}>
              <AppButton
                label="Delete"
                onPress={() => editCardRef.current?.delete()}
                style={styles.deleteButton}
                textStyle={styles.deleteButtonText}
              />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
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
    color: BRAND_COLORS.cream,
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
    backgroundColor: '#2A2A2A', // Dark gray for button background
    borderWidth: 0,
    borderRadius: BORDER_RADIUS.medium,
    width: '50%',
    paddingVertical: SPACING.sm,
  },
  deleteButtonText: {
    color: COLOR_PALETTE.systemError,
    fontWeight: '600',
    fontSize: 18,
  },
});
