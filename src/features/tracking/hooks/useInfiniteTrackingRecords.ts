import { useMemo } from 'react';
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import {
  fetchTrackingRecords,
  TrackingRecordApiResponse,
} from '../api/fetchTrackingRecords';
import { TRACKING_RECORDS_PAGE_SIZE } from '../constants';

export type UseInfiniteTrackingRecordsOptions = {
  enabled?: boolean;
};

const placeholderData: InfiniteData<TrackingRecordApiResponse[]> = {
  pages: [[]],
  pageParams: [0],
};

export const useInfiniteTrackingRecords = (
  options: UseInfiniteTrackingRecordsOptions = {},
) => {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  const queryKey = ['trackingRecords', 'infinite'];

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
      return fetchTrackingRecords({
        offset: pageParam as number,
      });
    },
    enabled,
    staleTime: Infinity, // Never consider data stale to prevent automatic refetches
    gcTime: Infinity, // Keep in cache indefinitely
    placeholderData,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the page size, we've reached the end
      if (!lastPage || lastPage.length < TRACKING_RECORDS_PAGE_SIZE) {
        return undefined;
      }

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

  // Flatten all pages into a single array and sort by event_at date (memoized)
  const sortedRecords = useMemo(() => {
    const flatRecords = query.data?.pages.flat() || [];
    return [...flatRecords].sort((a, b) => {
      const dateA = new Date(a.event_at);
      const dateB = new Date(b.event_at);
      return dateB.getTime() - dateA.getTime();
    });
  }, [query.data?.pages]);

  // Cache update utilities for optimistic updates
  // These preserve the infinite query structure while updating data
  const updateRecordInCache = (updatedRecord: TrackingRecordApiResponse) => {
    queryClient.setQueryData<InfiniteData<TrackingRecordApiResponse[]>>(
      queryKey,
      oldData => {
        if (!oldData?.pages) return oldData;

        const newPages = oldData.pages.map(page =>
          page.map(record =>
            record.record_id === updatedRecord.record_id
              ? updatedRecord
              : record,
          ),
        );

        // Preserve all infinite query metadata (pageParams, etc.)
        return {
          ...oldData,
          pages: newPages,
        };
      },
    );
  };

  const removeRecordFromCache = (recordId: number) => {
    queryClient.setQueryData<InfiniteData<TrackingRecordApiResponse[]>>(
      queryKey,
      oldData => {
        if (!oldData?.pages) return oldData;

        const newPages = oldData.pages.map(page =>
          page.filter(record => record.record_id !== recordId),
        );

        // Preserve all infinite query metadata (pageParams, etc.)
        return {
          ...oldData,
          pages: newPages,
        };
      },
    );
  };

  // Override cache with new records, using record_id as the key for deduplication
  const overrideCacheWithRecords = (
    newRecords: TrackingRecordApiResponse[],
  ) => {
    queryClient.setQueryData<InfiniteData<TrackingRecordApiResponse[]>>(
      queryKey,
      oldData => {
        if (!oldData?.pages) return oldData;

        const newPages = oldData.pages.map(page =>
          mergeRecordsById(page, newRecords),
        );

        // Preserve all infinite query metadata (pageParams, etc.)
        return {
          ...oldData,
          pages: newPages,
        };
      },
    );
  };

  const addRecordToCache = (newRecord: TrackingRecordApiResponse) => {
    queryClient.setQueryData<InfiniteData<TrackingRecordApiResponse[]>>(
      queryKey,
      oldData => {
        const pages = oldData?.pages ? [...oldData.pages] : [[]];
        const pageParams = oldData?.pageParams ? [...oldData.pageParams] : [0];

        const firstPage = [...pages[0]];

        // Find correct insertion position based on date (newest first)
        const newRecordTime = new Date(newRecord.event_at).getTime();
        let insertIndex = firstPage.findIndex(
          record => new Date(record.event_at).getTime() < newRecordTime,
        );

        if (insertIndex === -1) {
          insertIndex = firstPage.length;
        }

        firstPage.splice(insertIndex, 0, newRecord);
        pages[0] = firstPage;

        // Preserve all infinite query metadata
        return {
          ...oldData,
          pages,
          pageParams,
        };
      },
    );
  };

  // Replace optimistic record (temp ID) with real record from server
  const replaceOptimisticRecord = (
    tempId: number,
    realRecord: TrackingRecordApiResponse,
  ) => {
    queryClient.setQueryData<InfiniteData<TrackingRecordApiResponse[]>>(
      queryKey,
      oldData => {
        if (!oldData?.pages?.length) return oldData;

        const newPages = oldData.pages.map(page =>
          page.map(record =>
            record.record_id === tempId ? realRecord : record,
          ),
        );

        // Preserve all infinite query metadata
        return {
          ...oldData,
          pages: newPages,
        };
      },
    );
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
