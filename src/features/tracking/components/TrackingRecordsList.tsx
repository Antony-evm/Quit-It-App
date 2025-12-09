import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';

import {
  AppText,
  Box,
  StatusMessage,
  AppPressable,
  AppIcon,
} from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';
import { formatRelativeDate } from '@/utils/dateUtils';
import ChevronRight from '@/assets/chevronRight.svg';
import { useInfiniteTrackingRecords } from '../hooks/useInfiniteTrackingRecords';
import { useCravingAnalytics } from '../hooks/useCravingAnalytics';
import { useSmokingAnalytics } from '../hooks/useSmokingAnalytics';
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
  /** Callback when create button is pressed in empty state */
  onCreatePress?: () => void;
  /** Optional header component */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  /** Optional content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Total number of records across all pages */
  totalRecordsCount?: number;
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
    onCreatePress,
    ListHeaderComponent,
    contentContainerStyle,
    totalRecordsCount,
  }: TrackingRecordsListProps) => {
    const renderItemSeparator = useCallback(
      () => <Box style={{ height: SPACING.md }} />,
      [],
    );

    const renderItem: ListRenderItem<TransformedRecord> = useCallback(
      ({ item, index }) => (
        <TrackingRecordCard
          displayName={item.displayName}
          accentColor={item.accentColor}
          dateLabel={item.dateLabel}
          timeLabel={item.timeLabel}
          note={item.record.note}
          index={index}
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
      if (totalRecordsCount !== undefined && totalRecordsCount === 0) {
        return (
          <Box alignItems="flex-start">
            <Box flexDirection="row" alignItems="flex-start" mb="md">
              <AppText variant="body">
                Your notes help you understand your habits. Start with just one.
                Your future you will thank you.
              </AppText>
            </Box>

            <AppPressable
              onPress={onCreatePress}
              variant="callToAction"
              style={{ width: '60%' }}
            >
              <AppText variant="caption">Write your first note</AppText>
              <AppIcon icon={ChevronRight} variant="small" />
            </AppPressable>
          </Box>
        );
      }
    }, [isLoading, isError, errorMessage, onCreatePress, totalRecordsCount]);

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

      if (totalRecordsCount != undefined && totalRecordsCount > 0) {
        return (
          <Box alignItems="center" py="md">
            <AppPressable
              onPress={onLoadMore}
              accessibilityRole="button"
              accessibilityLabel="Load more records"
            >
              <AppText variant="body" tone="primary" link>
                Load More
              </AppText>
            </AppPressable>
          </Box>
        );
      }

      return null;
    }, [isFetchingNextPage, totalRecordsCount, onLoadMore]);

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
  onCreatePress?: () => void;
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
    onCreatePress,
    ListHeaderComponent,
    contentContainerStyle,
  }: TrackingRecordsListContainerProps) => {
    const { data: cravingAnalytics, isLoading: isCravingAnalyticsLoading } =
      useCravingAnalytics();
    const { data: smokingAnalytics, isLoading: isSmokingAnalyticsLoading } =
      useSmokingAnalytics();

    // Calculate total records from both cravings and smokes
    const totalRecordsCount = useMemo(() => {
      const cravingCount = cravingAnalytics?.total_cravings ?? 0;
      const smokeCount = smokingAnalytics?.total_smokes ?? 0;
      return cravingCount + smokeCount;
    }, [cravingAnalytics?.total_cravings, smokingAnalytics?.total_smokes]);

    const {
      flatRecords: trackingRecords,
      isLoading,
      isFetching,
      isPlaceholderData,
      isError,
      error,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
    } = useInfiniteTrackingRecords({ totalRecordsCount });

    // Show loading skeleton when initially fetching with placeholder data or analytics
    const showSkeleton =
      isLoading ||
      (isFetching && isPlaceholderData) ||
      isCravingAnalyticsLoading ||
      isSmokingAnalyticsLoading;

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
        isLoading={showSkeleton}
        isError={isError}
        errorMessage={error?.message}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onLoadMore={handleLoadMore}
        onRecordPress={onRecordPress}
        onCreatePress={onCreatePress}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={contentContainerStyle}
        totalRecordsCount={totalRecordsCount}
      />
    );
  },
);
