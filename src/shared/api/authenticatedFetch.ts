import AuthService from '../auth/authService';

/**
 * Configuration for authenticated API requests
 */
export interface ApiRequestConfig extends RequestInit {
  useSessionToken?: boolean; // Use session_token instead of JWT
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
      const {
        headers = {},
        useSessionToken = false,
        requiresAuth = true,
        ...restConfig
      } = config;

      // Prepare headers
      const requestHeaders = new Headers(headers);

      // Set default content type if not provided
      if (!requestHeaders.get('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json');
      }

      // Add authentication token if required
      if (requiresAuth) {
        const tokens = await AuthService.getAuthTokens();

        if (!tokens) {
          console.log('[ApiClient] No tokens found');
          throw new Error(
            'No authentication tokens found. User may need to log in.',
          );
        }

        // Use session_token or JWT based on preference
        const tokenToUse = useSessionToken
          ? tokens.sessionToken
          : tokens.sessionJwt;
        const authHeader = `Bearer ${tokenToUse}`;

        requestHeaders.set('Authorization', authHeader);
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
      const headers =
        config.headers instanceof Headers
          ? Object.fromEntries(config.headers.entries())
          : config.headers;

      console.log('[ApiClient] Making request:', {
        url,
        method: config.method || 'GET',
        headers,
      });

      return { url, config };
    });

    // Default response logging interceptor
    this.addResponseInterceptor((response, url, config) => {
      console.log('[ApiClient] Response received:', {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      return response;
    });

    // Default response error interceptor
    this.addResponseInterceptor(async (response, url, config) => {
      // Handle token expiration
      if (response.status === 401) {
        console.log('[ApiClient] 401 Unauthorized - clearing auth state');

        // Log response details for debugging
        const responseText = await response.clone().text();
        console.log('[ApiClient] 401 response body:', responseText);

        // Token might be expired - clear auth state
        await AuthService.clearAuth();
        throw new Error('Authentication failed. Please log in again.');
      }

      return response;
    });

    // Default error interceptor
    this.addErrorInterceptor((error, url, config) => {
      console.error('[ApiClient] Request failed:', {
        url,
        error: error.message,
        config: {
          ...config,
          headers:
            config.headers instanceof Headers
              ? Object.fromEntries(config.headers.entries())
              : config.headers,
        },
      });

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
  const tokens = await AuthService.getAuthTokens();
  return tokens?.userId || null;
}
