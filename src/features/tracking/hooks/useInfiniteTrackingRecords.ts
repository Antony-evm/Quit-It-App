import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';
import {
  fetchTrackingRecords,
  TrackingRecordApiResponse,
} from '../api/fetchTrackingRecords';
import { TRACKING_RECORDS_PAGE_SIZE } from '../constants';
import { useCurrentUserId } from './useCurrentUserId';

export type UseInfiniteTrackingRecordsOptions = {
  userId?: number;
  enabled?: boolean;
};

export const useInfiniteTrackingRecords = (
  options: UseInfiniteTrackingRecordsOptions = {},
) => {
  const { isAuthenticated } = useAuth();
  const currentUserId = useCurrentUserId();
  const { userId = currentUserId, enabled = true } = options;
  const queryClient = useQueryClient();

  const queryKey = ['trackingRecords', 'infinite', userId];

  // Helper function to merge new records with existing cache, removing duplicates
  const mergeRecordsById = (
    existingRecords: TrackingRecordApiResponse[],
    newRecords: TrackingRecordApiResponse[],
  ): TrackingRecordApiResponse[] => {
    const recordMap = new Map<number, TrackingRecordApiResponse>();

    // Add existing records to map
    existingRecords.forEach(record => {
      recordMap.set(record.record_id, record);
    });

    // Override with new records (this handles duplicates by using latest data)
    newRecords.forEach(record => {
      recordMap.set(record.record_id, record);
    });

    return Array.from(recordMap.values());
  };

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const newRecords = await fetchTrackingRecords({
        user_id: userId,
        offset: pageParam as number,
      });

      // After receiving new data, update the cache to handle duplicates across all pages
      setTimeout(() => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData?.pages) return oldData;

          // Flatten all existing records
          const allExistingRecords = oldData.pages.flat();

          // Merge with new records to remove duplicates
          const mergedRecords = mergeRecordsById(
            allExistingRecords,
            newRecords,
          );

          // Redistribute records back into pages
          const newPages: TrackingRecordApiResponse[][] = [];
          for (
            let i = 0;
            i < mergedRecords.length;
            i += TRACKING_RECORDS_PAGE_SIZE
          ) {
            newPages.push(
              mergedRecords.slice(i, i + TRACKING_RECORDS_PAGE_SIZE),
            );
          }

          // Preserve all infinite query metadata
          return {
            ...oldData,
            pages: newPages.length > 0 ? newPages : [[]],
          };
        });
      }, 0);

      return newRecords;
    },
    enabled: enabled && isAuthenticated, // Only fetch when user is authenticated AND enabled
    staleTime: Infinity, // Never consider data stale to prevent automatic refetches
    gcTime: 5 * 60 * 1000, // 5 minutes - shorter cache time to allow fresh data
    getNextPageParam: (lastPage, allPages) => {
      // Calculate current offset based on total records fetched so far
      const totalRecords = allPages.flat().length;

      // Calculate next offset for pagination
      const nextOffset = Math.floor(totalRecords / TRACKING_RECORDS_PAGE_SIZE);
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

  // Override cache with new records, using record_id as the key for deduplication
  const overrideCacheWithRecords = (
    newRecords: TrackingRecordApiResponse[],
  ) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages) return oldData;

      const newPages = oldData.pages.map((page: TrackingRecordApiResponse[]) =>
        mergeRecordsById(page, newRecords),
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

  // Replace optimistic record (temp ID) with real record from server
  const replaceOptimisticRecord = (
    tempId: number,
    realRecord: TrackingRecordApiResponse,
  ) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages?.length) return oldData;

      const newPages = oldData.pages.map((page: TrackingRecordApiResponse[]) =>
        page.map((record: TrackingRecordApiResponse) =>
          record.record_id === tempId ? realRecord : record,
        ),
      );

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
    overrideCacheWithRecords,
    replaceOptimisticRecord,
  };
};
