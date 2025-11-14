import { useQuery } from '@tanstack/react-query';
import {
  fetchTrackingRecords,
  TrackingRecordApiResponse,
} from '../api/fetchTrackingRecords';
import { DEFAULT_TRACKING_USER_ID } from '../constants';

export type UseTrackingRecordsOptions = {
  userId?: number;
  offset?: number;
  enabled?: boolean;
};

export const useTrackingRecords = (options: UseTrackingRecordsOptions = {}) => {
  const {
    userId = DEFAULT_TRACKING_USER_ID,
    offset = 0,
    enabled = true,
  } = options;

  return useQuery<TrackingRecordApiResponse[]>({
    queryKey: ['trackingRecords', userId, offset],
    queryFn: () => fetchTrackingRecords({ user_id: userId, offset }),
    enabled,
    staleTime: 30000, // 30 seconds
    select: data => {
      // Sort records by event_at date in descending order (newest first)
      return [...data].sort((a, b) => {
        const dateA = new Date(a.event_at);
        const dateB = new Date(b.event_at);
        return dateB.getTime() - dateA.getTime();
      });
    },
  });
};
