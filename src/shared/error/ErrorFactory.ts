import { AppError, ErrorCategory, ErrorSeverity } from './types';

export class ErrorFactory {
  // Network-related errors
  static networkError(
    message?: string,
    context?: Record<string, any>,
  ): AppError {
    return new AppError({
      code: 'NETWORK_ERROR',
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      userMessage:
        message ||
        'Network connection problem. Please check your internet connection and try again.',
      technicalMessage: `Network request failed: ${
        message || 'Unknown network error'
      }`,
      context,
      retryable: true,
    });
  }

  static apiError(
    statusCode: number,
    message?: string,
    context?: Record<string, any>,
  ): AppError {
    const isServerError = statusCode >= 500;
    const isClientError = statusCode >= 400 && statusCode < 500;

    let userMessage = 'Something went wrong. Please try again.';
    let severity = ErrorSeverity.MEDIUM;

    if (isServerError) {
      userMessage =
        'Server is temporarily unavailable. Please try again later.';
      severity = ErrorSeverity.HIGH;
    } else if (statusCode === 401) {
      userMessage = 'Your session has expired. Please log in again.';
      severity = ErrorSeverity.HIGH;
    } else if (statusCode === 403) {
      userMessage = "You don't have permission to perform this action.";
    } else if (statusCode === 404) {
      userMessage = 'The requested resource was not found.';
    } else if (isClientError) {
      userMessage =
        message || 'Invalid request. Please check your input and try again.';
    }

    return new AppError({
      code: `API_ERROR_${statusCode}`,
      category: ErrorCategory.NETWORK,
      severity,
      userMessage,
      technicalMessage: `API request failed with status ${statusCode}: ${
        message || 'No error message'
      }`,
      context: { statusCode, ...context },
      retryable: isServerError || statusCode === 429, // Retry for server errors or rate limiting
    });
  }

  // Authentication errors
  static authenticationError(
    message?: string,
    context?: Record<string, any>,
  ): AppError {
    return new AppError({
      code: 'AUTH_ERROR',
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      userMessage: message || 'Authentication failed. Please log in again.',
      technicalMessage: `Authentication error: ${
        message || 'Unknown auth error'
      }`,
      context,
      retryable: false,
    });
  }

  static sessionExpiredError(context?: Record<string, any>): AppError {
    return new AppError({
      code: 'SESSION_EXPIRED',
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      userMessage: 'Your session has expired. Please log in again.',
      technicalMessage: 'User session has expired',
      context,
      retryable: false,
    });
  }

  // Validation errors
  static validationError(
    field: string,
    message: string,
    context?: Record<string, any>,
  ): AppError {
    return new AppError({
      code: 'VALIDATION_ERROR',
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      userMessage: message,
      technicalMessage: `Validation failed for field '${field}': ${message}`,
      context: { field, ...context },
      retryable: false,
    });
  }

  static formValidationError(
    errors: Record<string, string>,
    context?: Record<string, any>,
  ): AppError {
    const firstError = Object.values(errors)[0];
    return new AppError({
      code: 'FORM_VALIDATION_ERROR',
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      userMessage: firstError || 'Please check your input and try again.',
      technicalMessage: `Form validation failed: ${JSON.stringify(errors)}`,
      context: { errors, ...context },
      retryable: false,
    });
  }

  // Storage errors
  static storageError(
    operation: string,
    error?: any,
    context?: Record<string, any>,
  ): AppError {
    const message =
      error instanceof Error
        ? error.message
        : String(error || 'Unknown storage error');

    return new AppError({
      code: 'STORAGE_ERROR',
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.MEDIUM,
      userMessage: 'Failed to save data locally. Please try again.',
      technicalMessage: `Storage ${operation} failed: ${message}`,
      context: { operation, originalError: error, ...context },
      retryable: true,
    });
  }

  // Business logic errors
  static businessLogicError(
    message: string,
    code?: string,
    context?: Record<string, any>,
  ): AppError {
    return new AppError({
      code: code || 'BUSINESS_LOGIC_ERROR',
      category: ErrorCategory.BUSINESS_LOGIC,
      severity: ErrorSeverity.MEDIUM,
      userMessage: message,
      technicalMessage: `Business logic error: ${message}`,
      context,
      retryable: false,
    });
  }

  // Permission errors
  static permissionError(
    message?: string,
    context?: Record<string, any>,
  ): AppError {
    return new AppError({
      code: 'PERMISSION_ERROR',
      category: ErrorCategory.PERMISSION,
      severity: ErrorSeverity.MEDIUM,
      userMessage:
        message || "You don't have permission to perform this action.",
      technicalMessage: `Permission denied: ${
        message || 'Unknown permission error'
      }`,
      context,
      retryable: false,
    });
  }

  // Unknown errors
  static unknownError(error: any, context?: Record<string, any>): AppError {
    const message = error instanceof Error ? error.message : String(error);

    return new AppError({
      code: 'UNKNOWN_ERROR',
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      userMessage: 'An unexpected error occurred. Please try again.',
      technicalMessage: `Unknown error: ${message}`,
      context: { originalError: error, ...context },
      retryable: true,
    });
  }

  // Helper method to convert any error to AppError
  static fromError(error: any, context?: Record<string, any>): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Check for common error patterns
      if (error.message.includes('Network')) {
        return this.networkError(error.message, context);
      }
      if (
        error.message.includes('Authentication') ||
        error.message.includes('Unauthorized')
      ) {
        return this.authenticationError(error.message, context);
      }
      if (
        error.message.includes('Storage') ||
        error.message.includes('AsyncStorage')
      ) {
        return this.storageError('operation', error, context);
      }
    }

    return this.unknownError(error, context);
  }
}
