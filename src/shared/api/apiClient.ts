import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { ErrorInterceptor } from './interceptors/ErrorInterceptor';
import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';
import { getTokens } from '../auth/authState';

/**
 * Configuration for authenticated API requests
 */
export interface ApiRequestConfig extends RequestInit {
  requiresAuth?: boolean; // Whether this request requires authentication (default: true)
  skipErrorHandler?: boolean; // Whether to skip automatic error handling (default: false)
}

/**
 * Request interceptor function
 */
type RequestInterceptor = (
  url: string,
  config: ApiRequestConfig,
) =>
  | Promise<{ url: string; config: ApiRequestConfig }>
  | { url: string; config: ApiRequestConfig };

/**
 * Response interceptor function
 */
type ResponseInterceptor = (
  response: Response,
  url: string,
  config: ApiRequestConfig,
) => Promise<Response> | Response;

/**
 * Error interceptor function
 */
type ApiErrorInterceptor = (
  error: Error,
  url: string,
  config: ApiRequestConfig,
) => Promise<never> | never;

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ApiErrorInterceptor[] = [];

  constructor() {
    this.setupDefaultInterceptors();
  }

  /**
   * Set the toast function for showing error messages
   */
  setToastFunction(
    toastFunction: (
      message: string,
      type: 'success' | 'error',
      duration?: number,
    ) => void,
  ): void {
    ErrorInterceptor.setToastFunction(toastFunction);
  }

  private setupDefaultInterceptors(): void {
    // Add timeout handling first
    this.addRequestInterceptor(TimeoutInterceptor.handleRequest);
    this.addErrorInterceptor(TimeoutInterceptor.handleError);

    // Use AuthInterceptor for request and response handling
    this.addRequestInterceptor(AuthInterceptor.handleRequest);
    this.addResponseInterceptor(AuthInterceptor.handleResponse);

    // Use ErrorInterceptor for error response handling
    this.addResponseInterceptor(ErrorInterceptor.handleResponse);
    this.addErrorInterceptor(ErrorInterceptor.handleError);
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ApiErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Enhanced fetch function that automatically includes authentication tokens and applies interceptors
   */
  async fetch(url: string, config: ApiRequestConfig = {}): Promise<Response> {
    try {
      // Apply request interceptors
      let processedUrl = url;
      let processedConfig = config;

      for (const interceptor of this.requestInterceptors) {
        const result = await interceptor(processedUrl, processedConfig);
        processedUrl = result.url;
        processedConfig = result.config;
      }

      // Make the actual request
      let response = await fetch(processedUrl, processedConfig);

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response, processedUrl, processedConfig);
      }

      return response;
    } catch (error) {
      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        interceptor(error as Error, url, config);
      }

      // If no error interceptor handled it, re-throw
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

/**
 * Enhanced fetch function that automatically includes authentication tokens
 */
export async function apiFetch(
  url: string,
  config: ApiRequestConfig = {},
): Promise<Response> {
  return apiClient.fetch(url, config);
}

/**
 * Export the API client instance for advanced usage (adding custom interceptors)
 */
export { apiClient };

/**
 * Convenience function for making authenticated GET requests
 */
export async function apiGet(
  url: string,
  config: Omit<ApiRequestConfig, 'method'> = {},
): Promise<Response> {
  return apiFetch(url, { ...config, method: 'GET' });
}

/**
 * Convenience function for making authenticated POST requests
 */
export async function apiPost<TData = unknown>(
  url: string,
  data?: TData,
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
): Promise<Response> {
  return apiFetch(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for making authenticated PUT requests
 */
export async function apiPut<TData = unknown>(
  url: string,
  data?: TData,
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
): Promise<Response> {
  return apiFetch(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for making authenticated DELETE requests
 */
export async function apiDelete(
  url: string,
  config: Omit<ApiRequestConfig, 'method'> = {},
): Promise<Response> {
  return apiFetch(url, { ...config, method: 'DELETE' });
}

/**
 * Get current user ID from stored tokens
 */
export function getCurrentUserId(): string | null {
  const tokens = getTokens();
  return tokens?.userId || null;
}

/**
 * Convenience function for making public GET requests (no authentication)
 */
export async function publicGet(
  url: string,
  config: Omit<ApiRequestConfig, 'method' | 'requiresAuth'> = {},
): Promise<Response> {
  return apiFetch(url, {
    ...config,
    method: 'GET',
    requiresAuth: false,
  });
}

/**
 * Convenience function for making public POST requests (no authentication)
 */
export async function publicPost<TData = unknown>(
  url: string,
  data?: TData,
  config: Omit<ApiRequestConfig, 'method' | 'body' | 'requiresAuth'> = {},
): Promise<Response> {
  return apiFetch(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    requiresAuth: false,
  });
}

/**
 * Convenience function for making public PUT requests (no authentication)
 */
export async function publicPut<TData = unknown>(
  url: string,
  data?: TData,
  config: Omit<ApiRequestConfig, 'method' | 'body' | 'requiresAuth'> = {},
): Promise<Response> {
  return apiFetch(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    requiresAuth: false,
  });
}

/**
 * Convenience function for making public DELETE requests (no authentication)
 */
export async function publicDelete(
  url: string,
  config: Omit<ApiRequestConfig, 'method' | 'requiresAuth'> = {},
): Promise<Response> {
  return apiFetch(url, {
    ...config,
    method: 'DELETE',
    requiresAuth: false,
  });
}
