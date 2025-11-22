import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { errorHandler, ErrorHandlerOptions, AppError } from '../error';
import { useToast } from '../components/toast';

interface ErrorContextValue {
  handleError: (error: any, options?: ErrorHandlerOptions) => Promise<AppError>;
  handleApiError: (
    response: Response,
    options?: ErrorHandlerOptions,
  ) => Promise<AppError>;
  handleNetworkError: (
    error: any,
    options?: ErrorHandlerOptions,
  ) => Promise<AppError>;
  handleValidationError: (
    field: string,
    message: string,
    options?: ErrorHandlerOptions,
  ) => Promise<AppError>;
  handleAuthenticationError: (
    message?: string,
    options?: ErrorHandlerOptions,
  ) => Promise<AppError>;
  handleStorageError: (
    operation: string,
    error: any,
    options?: ErrorHandlerOptions,
  ) => Promise<AppError>;
  withErrorHandling: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options?: ErrorHandlerOptions,
  ) => (...args: T) => Promise<R | null>;
  withErrorHandlingSync: <T extends any[], R>(
    fn: (...args: T) => R,
    options?: ErrorHandlerOptions,
  ) => (...args: T) => R | null;
}

const ErrorHandlerContext = createContext<ErrorContextValue | undefined>(
  undefined,
);

interface ErrorHandlerProviderProps {
  children: ReactNode;
  preferToast?: boolean; // Whether to prefer toast notifications over alerts
}

export const ErrorHandlerProvider: React.FC<ErrorHandlerProviderProps> = ({
  children,
  preferToast = false,
}) => {
  const { showToast } = useToast();

  // Set up the toast function for the error handler
  React.useEffect(() => {
    errorHandler.setToastFunction(showToast);
  }, [showToast]);

  const handleError = useCallback(
    async (
      error: any,
      options: ErrorHandlerOptions = {},
    ): Promise<AppError> => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.handleError(error, defaultOptions);
    },
    [preferToast],
  );

  const handleApiError = useCallback(
    async (
      response: Response,
      options: ErrorHandlerOptions = {},
    ): Promise<AppError> => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.handleApiError(response, defaultOptions);
    },
    [preferToast],
  );

  const handleNetworkError = useCallback(
    async (
      error: any,
      options: ErrorHandlerOptions = {},
    ): Promise<AppError> => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.handleNetworkError(error, defaultOptions);
    },
    [preferToast],
  );

  const handleValidationError = useCallback(
    async (
      field: string,
      message: string,
      options: ErrorHandlerOptions = {},
    ): Promise<AppError> => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.handleValidationError(field, message, defaultOptions);
    },
    [preferToast],
  );

  const handleAuthenticationError = useCallback(
    async (
      message?: string,
      options: ErrorHandlerOptions = {},
    ): Promise<AppError> => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.handleAuthenticationError(message, defaultOptions);
    },
    [preferToast],
  );

  const handleStorageError = useCallback(
    async (
      operation: string,
      error: any,
      options: ErrorHandlerOptions = {},
    ): Promise<AppError> => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.handleStorageError(operation, error, defaultOptions);
    },
    [preferToast],
  );

  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      options: ErrorHandlerOptions = {},
    ) => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.withErrorHandling(fn, defaultOptions);
    },
    [preferToast],
  );

  const withErrorHandlingSync = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => R,
      options: ErrorHandlerOptions = {},
    ) => {
      const defaultOptions: ErrorHandlerOptions = {
        showAlert: !preferToast,
        showToast: preferToast,
        logError: true,
        ...options,
      };

      return errorHandler.withErrorHandlingSync(fn, defaultOptions);
    },
    [preferToast],
  );

  const value: ErrorContextValue = {
    handleError,
    handleApiError,
    handleNetworkError,
    handleValidationError,
    handleAuthenticationError,
    handleStorageError,
    withErrorHandling,
    withErrorHandlingSync,
  };

  return (
    <ErrorHandlerContext.Provider value={value}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

export const useErrorHandler = (): ErrorContextValue => {
  const context = useContext(ErrorHandlerContext);
  if (context === undefined) {
    throw new Error(
      'useErrorHandler must be used within an ErrorHandlerProvider',
    );
  }
  return context;
};
