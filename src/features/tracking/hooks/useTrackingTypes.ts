import { useQuery } from '@tanstack/react-query';

import { fetchTrackingTypes } from '../api/fetchTrackingTypes';
import type { TrackingType } from '../types';

export const useTrackingTypes = () => {
  return useQuery<TrackingType[]>({
    queryKey: ['trackingTypes'],
    queryFn: fetchTrackingTypes,
  });
};
