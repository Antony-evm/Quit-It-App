import AuthService from '@/shared/auth/authService';
import { clearAuthState } from '@/shared/auth/authState';
import { parseApiErrorResponse, isErrorResponse } from '../apiErrorHandler';
import { resetNavigation } from '@/navigation/navigationRef';
import type { ApiRequestConfig } from '../apiClient';
import {
  NetworkTimeoutError,
  NetworkConnectionError,
} from './TimeoutInterceptor';

type ToastFunction = (
  message: string,
  type: 'success' | 'error',
  duration?: number,
) => void;

/**
 * Interceptor that handles API error responses
 */
export class ErrorInterceptor {
  private static toastFunction?: ToastFunction;

  /**
   * Set the toast function for showing error messages
   */
  static setToastFunction(toastFunction: ToastFunction): void {
    this.toastFunction = toastFunction;
  }

  /**
   * Response interceptor: Handles error responses from API
   */
  static async handleResponse(
    response: Response,
    url: string,
    config: ApiRequestConfig,
  ): Promise<Response> {
    if (isErrorResponse(response) && !config.skipErrorHandler) {
      const error = await parseApiErrorResponse(response.clone());

      // Show toast notification for errors
      if (this.toastFunction) {
        this.toastFunction(error.message, 'error', 4000);
      }

      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        await AuthService.clearAuth();
        clearAuthState();
        resetNavigation('Auth', { mode: 'login' });
      }
    }

    return response;
  }

  /**
   * Error interceptor: Handles network or other errors during request
   */
  static async handleError(
    error: Error,
    url: string,
    config: ApiRequestConfig,
  ): Promise<never> {
    // Don't show toast for network errors - let the UI handle them with offline screen
    const isNetworkError =
      error instanceof NetworkTimeoutError ||
      error instanceof NetworkConnectionError;

    // Show toast for non-network errors
    if (this.toastFunction && !config.skipErrorHandler && !isNetworkError) {
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.';
      this.toastFunction(message, 'error', 4000);
    }

    // Re-throw the error so it can be handled upstream
    throw error;
  }
}
