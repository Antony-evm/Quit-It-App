import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { AppText, DraggableModal } from '@/shared/components/ui';
import { SPACING, COLOR_PALETTE, BRAND_COLORS } from '@/shared/theme';
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
  const editCardRef = useRef<NotesCardHandle>(null);
  const editDrawerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const queryKey = ['trackingRecords', 'infinite', currentUserId];
    queryClient.resetQueries({ queryKey });
  }, [queryClient, currentUserId]);

  const handleRecordPress = (record: TrackingRecordApiResponse) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const renderHeaderContent = () => (
    <View style={styles.modalHeaderContent}>
      <Pressable
        onPress={() => setIsEditModalVisible(false)}
        style={styles.headerButton}
        hitSlop={10}
      >
        <CancelIcon width={24} height={24} color={BRAND_COLORS.cream} />
      </Pressable>

      <Pressable
        onPress={() => editCardRef.current?.save()}
        style={styles.headerButton}
        hitSlop={10}
      >
        <AppText variant="body" style={styles.saveButtonText}>
          Save
        </AppText>
      </Pressable>
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
        <ScrollView
          ref={editDrawerScrollRef}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          {selectedRecord && (
            <NotesCard
              ref={editCardRef}
              recordId={selectedRecord.record_id}
              initialValues={{
                trackingTypeId: selectedRecord.tracking_type_id,
                dateTime: parseTimestampFromAPI(selectedRecord.event_at),
                notes: selectedRecord.note || '',
              }}
              scrollViewRef={editDrawerScrollRef}
              onSaveSuccess={handleEditSuccess}
            />
          )}
        </ScrollView>
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
});
