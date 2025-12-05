import { getTokens, setTokens } from '@/shared/auth/authState';
import AuthService from '@/shared/auth/authService';
import { AuthTokens } from '@/shared/auth/types';
import type { ApiRequestConfig } from '../apiClient';

/**
 * Interceptor that handles authentication headers and token injection
 */
export class AuthInterceptor {
  /**
   * Request interceptor: Adds authentication headers to requests
   */
  static async handleRequest(
    url: string,
    config: ApiRequestConfig,
  ): Promise<{ url: string; config: ApiRequestConfig }> {
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

      if (tokens) {
        // Always send JWT token as Authorization Bearer
        const authHeader = `Bearer ${tokens.sessionJwt}`;
        requestHeaders.set('Authorization', authHeader);

        // Always send session token as X-Session-Token header
        requestHeaders.set('X-Session-Token', tokens.sessionToken);
        requestHeaders.set('X-User-ID', tokens.userId);
      }
    }

    return {
      url,
      config: {
        ...restConfig,
        headers: requestHeaders,
      },
    };
  }

  /**
   * Response interceptor: Handles token refresh from response headers
   */
  static async handleResponse(
    response: Response,
    url: string,
    config: ApiRequestConfig,
  ): Promise<Response> {
    const sessionToken = response.headers.get('X-Session-Token');
    const sessionJwt = response.headers.get('X-Session-JWT');

    if (sessionToken || sessionJwt) {
      const currentTokens = getTokens();
      if (currentTokens) {
        const updatedTokens: AuthTokens = {
          ...currentTokens,
          ...(sessionToken && { sessionToken }),
          ...(sessionJwt && { sessionJwt }),
        };

        await AuthService.storeTokens(updatedTokens);
        setTokens(updatedTokens);
      }
    }

    return response;
  }
}
