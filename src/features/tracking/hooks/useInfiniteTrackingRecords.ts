import { useInfiniteQuery } from '@tanstack/react-query';
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

  const query = useInfiniteQuery({
    queryKey: ['trackingRecords', 'infinite', userId],
    queryFn: ({ pageParam = 0 }) =>
      fetchTrackingRecords({ user_id: userId, offset: pageParam as number }),
    enabled,
    staleTime: 30000, // 30 seconds
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has data and is a full page, there might be more data
      // If the last page has fewer records than the expected page size, no more pages
      if (lastPage && lastPage.length >= TRACKING_RECORDS_PAGE_SIZE) {
        return allPages.length; // This will be the next offset (0, 1, 2, 3...)
      }
      return undefined; // No more pages
    },
    initialPageParam: 0,
  });

  // Flatten all pages into a single array and sort by event_at date
  const flatRecords = query.data?.pages.flat() || [];
  const sortedRecords = [...flatRecords].sort((a, b) => {
    const dateA = new Date(a.event_at);
    const dateB = new Date(b.event_at);
    return dateB.getTime() - dateA.getTime();
  });

  return {
    ...query,
    flatRecords: sortedRecords,
  };
};
