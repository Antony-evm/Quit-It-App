import AuthService from '../auth/authService';
import { clearAuthState, getTokens, setTokens } from '../auth/authState';
import { AuthTokens } from '../auth/types';

/**
 * Configuration for authenticated API requests
 */
export interface ApiRequestConfig extends RequestInit {
  requiresAuth?: boolean; // Whether this request requires authentication (default: true)
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
type ErrorInterceptor = (
  error: Error,
  url: string,
  config: ApiRequestConfig,
) => Promise<never> | never;

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor() {
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors() {
    // Default request interceptor for headers and auth
    this.addRequestInterceptor(async (url, config) => {
      const { headers = {}, requiresAuth = true, ...restConfig } = config;

      // Prepare headers
      const requestHeaders = new Headers(headers);

      // Set default content type if not provided
      if (!requestHeaders.get('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json');
      }

      // Add authentication token if required
      if (requiresAuth) {
        const tokens = getTokens();

        if (!tokens) {
          throw new Error(
            'No authentication tokens found. User may need to log in.',
          );
        }

        // Always send JWT token as Authorization Bearer
        const authHeader = `Bearer ${tokens.sessionJwt}`;
        requestHeaders.set('Authorization', authHeader);

        // Always send session token as X-Session-Token header
        requestHeaders.set('X-Session-Token', tokens.sessionToken);
        requestHeaders.set('X-User-ID', tokens.userId);
      }

      return {
        url,
        config: {
          ...restConfig,
          headers: requestHeaders,
        },
      };
    });

    // Default request logging interceptor
    this.addRequestInterceptor((url, config) => {
      const method = config.method || 'GET';

      // Log outgoing headers
      console.log(`[API Request] ${method} ${url}`);
      if (config.headers) {
        const headers =
          config.headers instanceof Headers
            ? Object.fromEntries(config.headers.entries())
            : config.headers;
        console.log('[API Request Headers]:', headers);
      }

      return { url, config };
    });

    // Default response logging interceptor
    this.addResponseInterceptor((response, url, config) => {
      const method = config.method || 'GET';
      const status = response.status;
      const statusText = status >= 400 ? ` (${response.statusText})` : '';

      // Log incoming response headers
      console.log(`[API Response] ${method} ${url} - ${status}${statusText}`);
      const responseHeaders = Object.fromEntries(response.headers.entries());
      console.log('[API Response Headers]:', responseHeaders);

      return response;
    });

    // Token refresh interceptor - check for new tokens in response headers
    this.addResponseInterceptor(async (response, url, config) => {
      const sessionToken = response.headers.get('X-Session-Token');
      const sessionJwt = response.headers.get('X-Session-JWT');

      // If either header is present, update the tokens
      if (sessionToken || sessionJwt) {
        const currentTokens = getTokens();
        if (currentTokens) {
          // Create updated token object
          const updatedTokens: AuthTokens = {
            ...currentTokens,
            ...(sessionToken && { sessionToken }),
            ...(sessionJwt && { sessionJwt }),
          };

          try {
            // Update both storage and in-memory state
            await AuthService.storeTokens(updatedTokens);
            setTokens(updatedTokens);
            console.log('[TokenRefresh] Updated tokens from response headers');
          } catch (error) {
            console.error('[TokenRefresh] Failed to update tokens:', error);
            // Continue with the response even if token update fails
          }
        }
      }

      return response;
    });

    // Default response error interceptor
    this.addResponseInterceptor(async (response, url, config) => {
      // Handle token expiration
      if (response.status === 401) {
        // Log response details for debugging
        const responseText = await response.clone().text();
        // Token might be expired - clear auth state
        await AuthService.clearAuth();
        clearAuthState();
        throw new Error('Authentication failed. Please log in again.');
      }

      return response;
    });

    // Default error interceptor
    this.addErrorInterceptor((error, url, config) => {
      throw error;
    });
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
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
export async function authenticatedFetch(
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
export async function authenticatedGet(
  url: string,
  config: Omit<ApiRequestConfig, 'method'> = {},
): Promise<Response> {
  return authenticatedFetch(url, { ...config, method: 'GET' });
}

/**
 * Convenience function for making authenticated POST requests
 */
export async function authenticatedPost(
  url: string,
  data?: any,
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
): Promise<Response> {
  return authenticatedFetch(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for making authenticated PUT requests
 */
export async function authenticatedPut(
  url: string,
  data?: any,
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
): Promise<Response> {
  return authenticatedFetch(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for making authenticated DELETE requests
 */
export async function authenticatedDelete(
  url: string,
  config: Omit<ApiRequestConfig, 'method'> = {},
): Promise<Response> {
  return authenticatedFetch(url, { ...config, method: 'DELETE' });
}

/**
 * Get current user ID from stored tokens
 */
export async function getCurrentUserId(): Promise<string | null> {
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
  return authenticatedFetch(url, {
    ...config,
    method: 'GET',
    requiresAuth: false,
  });
}

/**
 * Convenience function for making public POST requests (no authentication)
 */
export async function publicPost(
  url: string,
  data?: any,
  config: Omit<ApiRequestConfig, 'method' | 'body' | 'requiresAuth'> = {},
): Promise<Response> {
  return authenticatedFetch(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    requiresAuth: false,
  });
}

/**
 * Convenience function for making public PUT requests (no authentication)
 */
export async function publicPut(
  url: string,
  data?: any,
  config: Omit<ApiRequestConfig, 'method' | 'body' | 'requiresAuth'> = {},
): Promise<Response> {
  return authenticatedFetch(url, {
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
  return authenticatedFetch(url, {
    ...config,
    method: 'DELETE',
    requiresAuth: false,
  });
}
