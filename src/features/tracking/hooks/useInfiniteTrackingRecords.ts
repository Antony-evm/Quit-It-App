import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchTrackingRecords,
  TrackingRecordApiResponse,
} from '../api/fetchTrackingRecords';
import {
  DEFAULT_TRACKING_USER_ID,
  TRACKING_RECORDS_PAGE_SIZE,
} from '../constants';

export type UseInfiniteTrackingRecordsOptions = {
  userId?: number;
  enabled?: boolean;
};

export const useInfiniteTrackingRecords = (
  options: UseInfiniteTrackingRecordsOptions = {},
) => {
  const { userId = DEFAULT_TRACKING_USER_ID, enabled = true } = options;
  const queryClient = useQueryClient();

  const queryKey = ['trackingRecords', 'infinite', userId];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => {
      console.log(`Fetching tracking records with offset: ${pageParam}`);
      return fetchTrackingRecords({
        user_id: userId,
        offset: pageParam as number,
      });
    },
    enabled,
    staleTime: Infinity, // Never consider data stale to prevent automatic refetches
    gcTime: 5 * 60 * 1000, // 5 minutes - shorter cache time to allow fresh data
    getNextPageParam: (lastPage, allPages) => {
      console.log(
        `getNextPageParam called - lastPage length: ${lastPage.length}, total pages: ${allPages.length}`,
      );

      // Calculate current offset based on total records fetched so far
      const totalRecords = allPages.flat().length;

      // Calculate next offset for pagination
      const nextOffset = Math.floor(totalRecords / TRACKING_RECORDS_PAGE_SIZE);
      console.log(`Next offset will be: ${nextOffset}`);
      return nextOffset;
    },
    initialPageParam: 0,
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting to network
  });

  // Flatten all pages into a single array and sort by event_at date
  const flatRecords = query.data?.pages.flat() || [];
  const sortedRecords = [...flatRecords].sort((a, b) => {
    const dateA = new Date(a.event_at);
    const dateB = new Date(b.event_at);
    return dateB.getTime() - dateA.getTime();
  });

  // Cache update utilities for optimistic updates
  // These preserve the infinite query structure while updating data
  const updateRecordInCache = (updatedRecord: TrackingRecordApiResponse) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages) return oldData;

      const newPages = oldData.pages.map((page: TrackingRecordApiResponse[]) =>
        page.map((record: TrackingRecordApiResponse) =>
          record.record_id === updatedRecord.record_id ? updatedRecord : record,
        ),
      );

      // Preserve all infinite query metadata (pageParams, etc.)
      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const removeRecordFromCache = (recordId: number) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages) return oldData;

      const newPages = oldData.pages.map((page: TrackingRecordApiResponse[]) =>
        page.filter(
          (record: TrackingRecordApiResponse) => record.record_id !== recordId,
        ),
      );

      // Preserve all infinite query metadata (pageParams, etc.)
      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const addRecordToCache = (newRecord: TrackingRecordApiResponse) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages?.length) return oldData;

      const newPages = [...oldData.pages];
      const firstPage = [...newPages[0]];

      // Find correct insertion position based on date (newest first)
      const newRecordTime = new Date(newRecord.event_at).getTime();
      let insertIndex = firstPage.findIndex(
        record => new Date(record.event_at).getTime() < newRecordTime,
      );

      if (insertIndex === -1) {
        insertIndex = firstPage.length;
      }

      firstPage.splice(insertIndex, 0, newRecord);
      newPages[0] = firstPage;

      // Preserve all infinite query metadata
      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  return {
    ...query,
    flatRecords: sortedRecords,
    updateRecordInCache,
    removeRecordFromCache,
    addRecordToCache,
  };
};
