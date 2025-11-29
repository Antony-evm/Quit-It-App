import React, { RefObject } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';
import { TrackingRecordCard } from './TrackingRecordCard';

type TrackingRecordsListProps = {
  scrollViewRef?: RefObject<ScrollView | null>;
  onRecordPress?: (record: TrackingRecordApiResponse) => void;
};

export const TrackingRecordsList = React.memo(
  ({ scrollViewRef, onRecordPress }: TrackingRecordsListProps) => {
    const {
      flatRecords: trackingRecords,
      isLoading,
      isError,
      error,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
    } = useInfiniteTrackingRecords();

    const handleLoadMore = () => {
      if (hasNextPage && !isFetchingNextPage) {
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
          <AppText variant="body" tone="primary" style={styles.emptyText}>
            Your notes help you understand your habits. Start with just one.
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.recordsList}>
          {trackingRecords.map(record => (
            <TrackingRecordCard
              key={record.record_id}
              record={record}
              onPress={onRecordPress}
            />
          ))}
        </View>

        {isFetchingNextPage && (
          <View style={styles.loadingFooter}>
            <ActivityIndicator color={COLOR_PALETTE.accentPrimary} />
            <AppText variant="body" tone="primary" style={styles.loadingText}>
              Loading more records...
            </AppText>
          </View>
        )}

        {!isFetchingNextPage && hasNextPage && trackingRecords.length > 0 && (
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
  },
);

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
