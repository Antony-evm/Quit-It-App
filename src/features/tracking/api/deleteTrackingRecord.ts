import { API_BASE_URL } from '@/shared/api/apiConfig';

export const deleteTrackingRecord = async (recordId: number): Promise<void> => {
  const url = `${API_BASE_URL}/api/v1/tracking/${recordId}`;

  console.log('Deleting tracking record:', { recordId, url });

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete tracking record failed:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });

    throw new Error(
      `Failed to delete tracking record: ${response.status} ${response.statusText}`,
    );
  }

  console.log('Tracking record deleted successfully');
};
