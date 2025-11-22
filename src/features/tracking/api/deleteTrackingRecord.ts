import { authenticatedDelete, API_BASE_URL } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';

export const deleteTrackingRecord = async (recordId: number): Promise<void> => {
  const url = `${API_BASE_URL}/api/v1/tracking/${recordId}`;

  console.log('Deleting tracking record:', { recordId, url });

  try {
    const response = await authenticatedDelete(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete tracking record failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });

      throw ErrorFactory.apiError(
        response.status,
        errorText || 'Failed to delete tracking record',
        {
          recordId,
          url,
          operation: 'delete_tracking_record',
        },
      );
    }

    console.log('Tracking record deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw ErrorFactory.networkError(
      `Failed to delete tracking record: ${
        error instanceof Error ? error.message : String(error)
      }`,
      {
        recordId,
        url,
        operation: 'delete_tracking_record',
        originalError: error,
      },
    );
  }
};
