// Main exports
export { ErrorHandlerService } from './ErrorHandlerService';
export { ErrorFactory } from './ErrorFactory';
export { ErrorLogger } from './ErrorLogger';
export { ErrorHandlerProvider, useErrorHandler } from './ErrorContext';
export { GlobalErrorBoundary } from './GlobalErrorBoundary';

// Types
export type { AppErrorDetails, ErrorSeverity, ErrorCategory } from './types';

export { AppError } from './types';

// Re-export for convenience
export type { ErrorHandlerOptions, ToastFunction } from './ErrorHandlerService';

export type { ErrorLogEntry } from './ErrorLogger';

// Convenience function to get the error handler instance
import { ErrorHandlerService } from './ErrorHandlerService';
import { ErrorLogger } from './ErrorLogger';

export const errorHandler = ErrorHandlerService.getInstance();
export const errorLogger = ErrorLogger.getInstance();
