import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { AppText, StatusMessage } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';
import { TrackingRecordCard } from './TrackingRecordCard';

type TrackingRecordsListProps = {
  onRecordPress?: (record: TrackingRecordApiResponse) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const TrackingRecordsList = React.memo(
  ({
    onRecordPress,
    ListHeaderComponent,
    contentContainerStyle,
  }: TrackingRecordsListProps) => {
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

    const renderItem: ListRenderItem<TrackingRecordApiResponse> = useCallback(
      ({ item }) => (
        <View style={styles.itemContainer}>
          <TrackingRecordCard record={item} onPress={onRecordPress} />
        </View>
      ),
      [onRecordPress],
    );

    const ListEmptyComponent = useCallback(() => {
      if (isLoading) {
        return (
          <StatusMessage
            type="loading"
            message="Bringing your notes together..."
            style={styles.container}
          />
        );
      }

      if (isError) {
        return (
          <StatusMessage
            type="error"
            message={`Failed to load tracking records: ${
              error?.message || 'Unknown error'
            }`}
            style={styles.container}
          />
        );
      }

      return (
        <View style={styles.container}>
          <AppText variant="body" tone="primary" style={styles.emptyText}>
            Your notes help you understand your habits. Start with just one.
          </AppText>
        </View>
      );
    }, [isLoading, isError, error]);

    const ListFooterComponent = useCallback(() => {
      if (isFetchingNextPage) {
        return (
          <StatusMessage
            type="loading"
            message="Loading more records..."
            showSpinner
          />
        );
      }

      if (hasNextPage && trackingRecords && trackingRecords.length > 0) {
        return (
          <View style={styles.loadMoreContainer}>
            <AppText
              variant="body"
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              Load More
            </AppText>
          </View>
        );
      }

      return null;
    }, [isFetchingNextPage, hasNextPage, trackingRecords]);

    return (
      <FlatList
        data={trackingRecords || []}
        renderItem={renderItem}
        keyExtractor={item => String(item.record_id)}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
  },
  itemContainer: {
    marginBottom: SPACING.xs,
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
  emptyText: {
    textAlign: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
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
