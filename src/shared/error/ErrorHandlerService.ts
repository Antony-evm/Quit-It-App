import { Alert, AlertButton } from 'react-native';
import { AppError, ErrorSeverity } from './types';
import { ErrorFactory } from './ErrorFactory';
import { ErrorLogger } from './ErrorLogger';

export interface ErrorHandlerOptions {
  showAlert?: boolean;
  showToast?: boolean;
  logError?: boolean;
  context?: Record<string, any>;
}

export interface ToastFunction {
  (message: string, type: 'success' | 'error', duration?: number): void;
}

export class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  private logger = ErrorLogger.getInstance();
  private toastFunction?: ToastFunction;

  private constructor() {}

  static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  setToastFunction(toastFunction: ToastFunction): void {
    this.toastFunction = toastFunction;
  }

  async handleError(
    error: any,
    options: ErrorHandlerOptions = {},
  ): Promise<AppError> {
    const {
      showAlert = true,
      showToast = false,
      logError = true,
      context = {},
    } = options;

    // Convert to AppError if needed
    const appError = ErrorFactory.fromError(error, context);

    // Log the error
    if (logError) {
      await this.logger.log(appError, {
        additionalContext: context,
      });
    }

    // Show user notification based on preferences
    if (appError.showToUser) {
      if (showToast && this.toastFunction) {
        this.showToast(appError);
      } else if (showAlert) {
        this.showAlert(appError);
      }
    }

    return appError;
  }

  async handleApiError(
    response: Response,
    options: ErrorHandlerOptions = {},
  ): Promise<AppError> {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorData: any = {};

    try {
      // Try to extract error details from response
      const text = await response.text();
      if (text) {
        try {
          errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use the text as error message
          errorMessage = text;
        }
      }
    } catch {
      // If response reading fails, use default message
    }

    const appError = ErrorFactory.apiError(response.status, errorMessage, {
      url: response.url,
      errorData,
      ...options.context,
    });

    return this.handleError(appError, options);
  }

  async handleNetworkError(
    error: any,
    options: ErrorHandlerOptions = {},
  ): Promise<AppError> {
    const appError = ErrorFactory.networkError(
      error instanceof Error ? error.message : String(error),
      options.context,
    );

    return this.handleError(appError, options);
  }

  async handleValidationError(
    field: string,
    message: string,
    options: ErrorHandlerOptions = {},
  ): Promise<AppError> {
    const appError = ErrorFactory.validationError(
      field,
      message,
      options.context,
    );
    return this.handleError(appError, options);
  }

  async handleAuthenticationError(
    message?: string,
    options: ErrorHandlerOptions = {},
  ): Promise<AppError> {
    const appError = ErrorFactory.authenticationError(message, options.context);
    return this.handleError(appError, options);
  }

  async handleStorageError(
    operation: string,
    error: any,
    options: ErrorHandlerOptions = {},
  ): Promise<AppError> {
    const appError = ErrorFactory.storageError(
      operation,
      error,
      options.context,
    );
    return this.handleError(appError, options);
  }

  private showAlert(error: AppError): void {
    const title = this.getAlertTitle(error);
    const buttons = this.getAlertButtons(error);

    Alert.alert(title, error.userMessage, buttons);
  }

  private showToast(error: AppError): void {
    if (!this.toastFunction) return;

    const type = this.getToastType(error);
    this.toastFunction(error.userMessage, type);
  }

  private getAlertTitle(error: AppError): string {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'Critical Error';
      case ErrorSeverity.HIGH:
        return 'Error';
      case ErrorSeverity.MEDIUM:
        return 'Warning';
      case ErrorSeverity.LOW:
        return 'Notice';
      default:
        return 'Error';
    }
  }

  private getToastType(error: AppError): 'success' | 'error' {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
      case ErrorSeverity.LOW:
        return 'error'; // Use error for all error types since toast only has success/error
      default:
        return 'error';
    }
  }

  private getAlertButtons(error: AppError): AlertButton[] {
    const buttons: AlertButton[] = [{ text: 'OK', style: 'default' }];

    // Add retry button for retryable errors
    if (error.retryable) {
      buttons.unshift({
        text: 'Retry',
        style: 'default',
        onPress: () => {
          // TODO: Implement retry logic
          console.log('Retry requested for error:', error.code);
        },
      });
    }

    return buttons;
  }

  // Utility methods for common error handling patterns

  withErrorHandling<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options: ErrorHandlerOptions = {},
  ) {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        await this.handleError(error, options);
        return null;
      }
    };
  }

  withErrorHandlingSync<T extends any[], R>(
    fn: (...args: T) => R,
    options: ErrorHandlerOptions = {},
  ) {
    return (...args: T): R | null => {
      try {
        return fn(...args);
      } catch (error) {
        // For sync functions, we can't await, so we handle without waiting
        this.handleError(error, options);
        return null;
      }
    };
  }

  // Get error handler instance for convenience
  getLogger(): ErrorLogger {
    return this.logger;
  }
}
