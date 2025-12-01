import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';
import {
  fetchTrackingRecords,
  TrackingRecordApiResponse,
} from '../api/fetchTrackingRecords';

export type UseTrackingRecordsOptions = {
  offset?: number;
  enabled?: boolean;
};

export const useTrackingRecords = (options: UseTrackingRecordsOptions = {}) => {
  const { isAuthenticated } = useAuth();
  const { offset = 0, enabled = true } = options;

  return useQuery<TrackingRecordApiResponse[]>({
    queryKey: ['trackingRecords', offset],
    queryFn: () => fetchTrackingRecords({ offset }),
    enabled: enabled && isAuthenticated, // Only fetch when user is authenticated AND enabled
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
