import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import { TrackingRecordCard } from './TrackingRecordCard';
import type { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';

export const TrackingRecordsList: React.FC = () => {
  const {
    flatRecords: trackingRecords,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTrackingRecords();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppText variant="body" tone="secondary" style={styles.loadingText}>
          Loading tracking records...
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
          No tracking records found. Start by adding your first entry above!
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText variant="heading" style={styles.sectionTitle}>
        Recent Activity
      </AppText>

      <View style={styles.recordsList}>
        {trackingRecords.map(record => (
          <TrackingRecordCard key={record.record_id} record={record} />
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

      {hasNextPage && !isFetchingNextPage && trackingRecords.length > 0 && (
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
