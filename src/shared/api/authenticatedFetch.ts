import AuthService from '../auth/authService';

/**
 * Configuration for authenticated API requests
 */
export interface ApiRequestConfig extends RequestInit {
  useSessionToken?: boolean; // Use session_token instead of JWT
  requiresAuth?: boolean; // Whether this request requires authentication (default: true)
}

/**
 * Enhanced fetch function that automatically includes authentication tokens
 */
export async function authenticatedFetch(
  url: string,
  config: ApiRequestConfig = {},
): Promise<Response> {
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
      console.log('[AuthenticatedFetch] No tokens found');
      throw new Error(
        'No authentication tokens found. User may need to log in.',
      );
    }

    console.log('[AuthenticatedFetch] Tokens available:', {
      hasSessionJwt: !!tokens.sessionJwt,
      hasSessionToken: !!tokens.sessionToken,
      userId: tokens.userId,
      useSessionToken,
    });

    // Use session_token or JWT based on preference
    const tokenToUse = useSessionToken ? tokens.sessionToken : tokens.sessionJwt;
    const authHeader = `Bearer ${tokenToUse}`;

    console.log('[AuthenticatedFetch] Using token type:', useSessionToken ? 'sessionToken' : 'sessionJwt');
    console.log('[AuthenticatedFetch] Token preview:', tokenToUse ? `${tokenToUse.substring(0, 20)}...` : 'null');

    requestHeaders.set('Authorization', authHeader);

    // Also include user ID for backend convenience
    requestHeaders.set('X-User-ID', tokens.userId);
  }

  // Make the request
  console.log('[AuthenticatedFetch] Making request to:', url);
  console.log('[AuthenticatedFetch] Request headers:', Object.fromEntries(requestHeaders.entries()));
  
  const response = await fetch(url, {
    ...restConfig,
    headers: requestHeaders,
  });

  console.log('[AuthenticatedFetch] Response status:', response.status);

  // Handle token expiration
  if (response.status === 401) {
    console.log('[AuthenticatedFetch] 401 Unauthorized - clearing auth state');
    
    // Log response details for debugging
    const responseText = await response.clone().text();
    console.log('[AuthenticatedFetch] 401 response body:', responseText);
    
    // Token might be expired - clear auth state
    await AuthService.clearAuth();
    throw new Error('Authentication failed. Please log in again.');
  }

  return response;
}

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
