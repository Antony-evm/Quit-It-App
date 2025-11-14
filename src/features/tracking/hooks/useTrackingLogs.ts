import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchTrackingRecords } from '../api/fetchTrackingRecords';
import type { TrackingRecord } from '../types';
import { DEFAULT_TRACKING_USER_ID } from '../constants';

export type UseTrackingLogsOptions = {
  userId?: number;
  trackingTypeId?: number | null;
  enabled?: boolean;
};

export const useTrackingLogs = (options: UseTrackingLogsOptions = {}) => {
  const userId = options.userId ?? DEFAULT_TRACKING_USER_ID;
  const trackingTypeId = options.trackingTypeId ?? null;
  const enabled = options.enabled ?? true;

  const queryResult = useInfiniteQuery({
    queryKey: ['trackingLogs', userId, trackingTypeId],
    initialPageParam: 0,
    enabled,
    queryFn: ({ pageParam = 0 }) =>
      fetchTrackingRecords({
        userId,
        trackingTypeId,
        offset: typeof pageParam === 'number' ? pageParam : 0,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.records.length) {
        return undefined;
      }

      return lastPage.offset + 1;
    },
  });

  const records = useMemo<TrackingRecord[]>(
    () =>
      queryResult.data?.pages.reduce<TrackingRecord[]>(
        (acc, page) => acc.concat(page.records),
        [],
      ) ?? [],
    [queryResult.data],
  );

  const loadMore = useCallback(() => {
    if (!queryResult.hasNextPage || queryResult.isFetchingNextPage) {
      return Promise.resolve();
    }

    return queryResult.fetchNextPage();
  }, [queryResult]);

  const refresh = useCallback(() => {
    return queryResult.refetch();
  }, [queryResult]);

  return {
    records,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isError: queryResult.isError,
    isRefetching: queryResult.isRefetching,
    isFetchingNextPage: queryResult.isFetchingNextPage,
    hasNextPage: Boolean(queryResult.hasNextPage),
    loadMore,
    refresh,
    refetch: queryResult.refetch,
  };
};
