import { authenticatedDelete } from '@/shared/api/apiConfig';
import { ErrorFactory } from '@/shared/error';
import { TRACKING_ENDPOINT } from './endpoints';

const validateRecordId = (recordId: number): void => {
  if (!recordId || recordId <= 0) {
    throw ErrorFactory.validationError('recordId', 'Invalid record ID');
  }
};

export const deleteTrackingRecord = async (recordId: number): Promise<void> => {
  validateRecordId(recordId);

  const url = `${TRACKING_ENDPOINT}/${recordId}`;

  try {
    const response = await authenticatedDelete(url);

    if (!response.ok) {
      const errorText = await response.text();
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
