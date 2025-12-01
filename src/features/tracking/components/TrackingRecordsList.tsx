import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';

import {
  AppText,
  Box,
  StatusMessage,
  AppPressable,
} from '@/shared/components/ui';
import { formatRelativeDate } from '@/utils/dateUtils';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import { useTrackingTypes } from '../hooks/useTrackingTypes';
import { TrackingRecordApiResponse } from '../api/fetchTrackingRecords';
import { TrackingRecordCard } from './TrackingRecordCard';
import { TrackingRecordCardSkeleton } from './TrackingRecordCardSkeleton';
import { getTrackingTypeColors } from '../constants';
import type { TrackingType } from '../types';

// ============================================================================
// Types
// ============================================================================

export type TransformedRecord = {
  record: TrackingRecordApiResponse;
  displayName: string;
  accentColor: string;
  dateLabel: string;
  timeLabel: string;
};

/** Props for the presentational TrackingRecordsList component */
export type TrackingRecordsListProps = {
  /** Transformed records to display */
  records: TransformedRecord[];
  /** Whether the initial data is loading */
  isLoading: boolean;
  /** Whether there was an error loading data */
  isError: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Whether more records are being fetched */
  isFetchingNextPage: boolean;
  /** Whether there are more records to load */
  hasNextPage: boolean;
  /** Callback when user requests more records */
  onLoadMore: () => void;
  /** Callback when a record is pressed */
  onRecordPress?: (record: TrackingRecordApiResponse) => void;
  /** Optional header component */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  /** Optional content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

// ============================================================================
// Utilities
// ============================================================================

export const transformRecord = (
  record: TrackingRecordApiResponse,
  trackingTypesMap: Map<number, TrackingType>,
): TransformedRecord => {
  const trackingType = trackingTypesMap.get(record.tracking_type_id);
  const colors = getTrackingTypeColors(trackingType?.code);
  const { dateLabel, timeLabel } = formatRelativeDate(record.event_at);

  return {
    record,
    displayName: trackingType?.displayName || `Type ${record.tracking_type_id}`,
    accentColor: colors.accent,
    dateLabel,
    timeLabel,
  };
};

export const createTrackingTypesMap = (
  trackingTypes: TrackingType[] | undefined,
): Map<number, TrackingType> => {
  const map = new Map<number, TrackingType>();
  trackingTypes?.forEach(type => map.set(type.id, type));
  return map;
};

// ============================================================================
// Presentational Component (Dumb)
// ============================================================================

/**
 * Presentational component for displaying a list of tracking records.
 * This is a dumb component that receives all data and callbacks as props.
 */
export const TrackingRecordsList = React.memo(
  ({
    records,
    isLoading,
    isError,
    errorMessage,
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    onRecordPress,
    ListHeaderComponent,
    contentContainerStyle,
  }: TrackingRecordsListProps) => {
    const renderItemSeparator = useCallback(
      () => <Box style={{ height: 16 }} />,
      [],
    );

    const renderItem: ListRenderItem<TransformedRecord> = useCallback(
      ({ item }) => (
        <TrackingRecordCard
          displayName={item.displayName}
          accentColor={item.accentColor}
          dateLabel={item.dateLabel}
          timeLabel={item.timeLabel}
          note={item.record.note}
          onPress={onRecordPress ? () => onRecordPress(item.record) : undefined}
        />
      ),
      [onRecordPress],
    );

    const ListEmptyComponent = useCallback(() => {
      if (isLoading) {
        return <TrackingRecordCardSkeleton count={3} />;
      }

      if (isError) {
        return (
          <StatusMessage
            type="error"
            message={errorMessage || 'Failed to load tracking records'}
          />
        );
      }

      return (
        <StatusMessage
          type="info"
          message="Your notes help you understand your habits. Start with just one."
        />
      );
    }, [isLoading, isError, errorMessage]);

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

      if (hasNextPage && records.length > 0) {
        return (
          <Box alignItems="center" py="md">
            <AppPressable
              onPress={onLoadMore}
              accessibilityRole="button"
              accessibilityLabel="Load more records"
            >
              <AppText variant="body" tone="primary">
                Load More
              </AppText>
            </AppPressable>
          </Box>
        );
      }

      return null;
    }, [isFetchingNextPage, hasNextPage, records.length, onLoadMore]);

    return (
      <FlatList
        data={records}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={item => String(item.record.record_id)}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    );
  },
);

// ============================================================================
// Container Component (Smart)
// ============================================================================

type TrackingRecordsListContainerProps = {
  onRecordPress?: (record: TrackingRecordApiResponse) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Container component that connects TrackingRecordsList to data fetching hooks.
 * Use this when you want the component to manage its own data fetching.
 */
export const TrackingRecordsListContainer = React.memo(
  ({
    onRecordPress,
    ListHeaderComponent,
    contentContainerStyle,
  }: TrackingRecordsListContainerProps) => {
    const {
      flatRecords: trackingRecords,
      isLoading,
      isError,
      error,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
    } = useInfiniteTrackingRecords();

    const { data: trackingTypes } = useTrackingTypes();

    const trackingTypesMap = useMemo(
      () => createTrackingTypesMap(trackingTypes),
      [trackingTypes],
    );

    const transformedRecords = useMemo(() => {
      if (!trackingRecords) return [];
      return trackingRecords.map(record =>
        transformRecord(record, trackingTypesMap),
      );
    }, [trackingRecords, trackingTypesMap]);

    const handleLoadMore = useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
      <TrackingRecordsList
        records={transformedRecords}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onLoadMore={handleLoadMore}
        onRecordPress={onRecordPress}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={contentContainerStyle}
      />
    );
  },
);
