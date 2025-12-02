import { apiDelete } from '@/shared/api/apiConfig';
import { TRACKING_ENDPOINT } from './endpoints';

export const deleteTrackingRecord = async (recordId: number): Promise<void> => {
  const url = `${TRACKING_ENDPOINT}/${recordId}`;
  const response = await apiDelete(url);

  if (!response.ok) {
    throw new Error('Failed to delete tracking record');
  }
};
