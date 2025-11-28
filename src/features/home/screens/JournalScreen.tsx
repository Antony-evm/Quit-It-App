import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Modal, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { AppText } from '@/shared/components/ui';
import { SPACING, COLOR_PALETTE, BRAND_COLORS } from '@/shared/theme';
import { TrackingRecordsList } from '@/features/tracking/components/TrackingRecordsList';
import { useCurrentUserId } from '@/features/tracking/hooks/useCurrentUserId';
import {
  NotesCard,
  NotesCardHandle,
} from '@/features/home/components/NotesCard';
import { TrackingRecordApiResponse } from '@/features/tracking/api/fetchTrackingRecords';
import CancelIcon from '@/assets/cancel.svg';
import CheckmarkIcon from '@/assets/checkmark.svg';
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

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeaderContent}>
              <Pressable
                onPress={() => setIsEditModalVisible(false)}
                style={styles.headerButton}
                hitSlop={10}
              >
                <CancelIcon width={24} height={24} fill={BRAND_COLORS.cream} />
              </Pressable>

              <Pressable
                onPress={() => editCardRef.current?.save()}
                style={styles.headerButton}
                hitSlop={10}
              >
                <CheckmarkIcon
                  width={24}
                  height={24}
                  fill={BRAND_COLORS.cream}
                />
              </Pressable>
            </View>
          </View>
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
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  modalHeader: {
    backgroundColor: BRAND_COLORS.dark,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: COLOR_PALETTE.borderDefault,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.xs,
  },
  modalContent: {
    padding: SPACING.md,
  },
});
