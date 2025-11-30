import React, { useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { AppText, Box, StatusMessage } from '@/shared/components/ui';
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

    const renderItemSeparator = useCallback(
      () => <Box variant="separator" />,
      [],
    );

    const renderItem: ListRenderItem<TrackingRecordApiResponse> = useCallback(
      ({ item }) => (
        <TrackingRecordCard record={item} onPress={onRecordPress} />
      ),
      [onRecordPress],
    );

    const ListEmptyComponent = useCallback(() => {
      if (isLoading) {
        return (
          <StatusMessage
            type="loading"
            message="Bringing your notes together..."
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
          />
        );
      }

      return (
        <Box>
          <AppText>
            Your notes help you understand your habits. Start with just one.
          </AppText>
        </Box>
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
          <Box alignItems="center" py="md">
            <AppText
              style={{ textDecorationLine: 'underline' }}
              onPress={handleLoadMore}
            >
              Load More
            </AppText>
          </Box>
        );
      }

      return null;
    }, [isFetchingNextPage, hasNextPage, trackingRecords]);

    return (
      <FlatList
        data={trackingRecords || []}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
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
  sectionTitle: {
    color: COLOR_PALETTE.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
});
