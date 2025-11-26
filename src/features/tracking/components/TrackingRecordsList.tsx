import React, { RefObject } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import { TrackingRecordCard } from './TrackingRecordCard';

type TrackingRecordsListProps = {
  scrollViewRef?: RefObject<ScrollView | null>;
};

export const TrackingRecordsList: React.FC<TrackingRecordsListProps> = ({
  scrollViewRef,
}) => {
  const {
    flatRecords: trackingRecords,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteTrackingRecords();

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppText variant="body" tone="primary" style={styles.loadingText}>
          Bringing your notes together...
        </AppText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <AppText variant="body" style={styles.errorText}>
          Failed to load tracking records: {error?.message || 'Unknown error'}
        </AppText>
      </View>
    );
  }

  if (!trackingRecords || trackingRecords.length === 0) {
    return (
      <View style={styles.container}>
        <AppText variant="body" tone="secondary" style={styles.emptyText}>
          Your notes help you understand your habits. Start with just one.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText variant="heading" style={styles.sectionTitle}>
        Your Journey So Far
      </AppText>

      <View style={styles.recordsList}>
        {trackingRecords.map(record => (
          <TrackingRecordCard
            key={record.record_id}
            record={record}
            scrollViewRef={scrollViewRef}
          />
        ))}
      </View>

      {isFetchingNextPage && (
        <View style={styles.loadingFooter}>
          <ActivityIndicator color={COLOR_PALETTE.accentPrimary} />
          <AppText variant="body" tone="secondary" style={styles.loadingText}>
            Loading more records...
          </AppText>
        </View>
      )}

      {!isFetchingNextPage && trackingRecords.length > 0 && (
        <View style={styles.loadMoreContainer}>
          <AppText
            variant="body"
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
          >
            Load More
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    color: COLOR_PALETTE.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  recordsList: {
    paddingBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  loadingText: {
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  errorText: {
    textAlign: 'center',
    paddingVertical: SPACING.lg,
    color: COLOR_PALETTE.systemError,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  loadingFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  loadMoreButton: {
    color: COLOR_PALETTE.accentPrimary,
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '500',
  },
});
