import { ApiRequestConfig } from '../apiClient';

/**
 * Network timeout configuration
 */
const NETWORK_TIMEOUT_MS = 5000; // 5 seconds

/**
 * Error that indicates a network timeout occurred
 */
export class NetworkTimeoutError extends Error {
  constructor(url: string) {
    super(`Network request timed out after ${NETWORK_TIMEOUT_MS}ms: ${url}`);
    this.name = 'NetworkTimeoutError';
  }
}

/**
 * Error that indicates a network connection failure
 */
export class NetworkConnectionError extends Error {
  public readonly originalError?: Error;

  constructor(url: string, originalError?: Error) {
    super(`Network connection failed: ${url}`);
    this.name = 'NetworkConnectionError';
    this.originalError = originalError;
  }
}

/**
 * Interceptor that adds timeout handling to network requests
 */
export class TimeoutInterceptor {
  /**
   * Wrap a fetch request with timeout handling
   */
  static async handleRequest(
    url: string,
    config: ApiRequestConfig,
  ): Promise<{ url: string; config: ApiRequestConfig }> {
    // Add timeout signal if not already present
    if (!config.signal) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, NETWORK_TIMEOUT_MS);

      // Store timeout ID so we can clear it later
      const originalSignal = controller.signal;
      config.signal = originalSignal;

      // Clear timeout when request completes
      const cleanup = () => clearTimeout(timeoutId);
      originalSignal.addEventListener('abort', cleanup);
    }

    return { url, config };
  }

  /**
   * Handle timeout errors in responses
   */
  static async handleError(
    error: Error,
    url: string,
    config: ApiRequestConfig,
  ): Promise<never> {
    // Convert abort errors to timeout errors
    // Check both error.name and error.message for abort detection
    if (
      error.name === 'AbortError' ||
      error.message === 'Aborted' ||
      error.message.includes('aborted')
    ) {
      throw new NetworkTimeoutError(url);
    }

    // Convert network errors to connection errors
    if (
      error.message.includes('Network request failed') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    ) {
      throw new NetworkConnectionError(url, error);
    }

    // Re-throw other errors
    throw error;
  }
}
