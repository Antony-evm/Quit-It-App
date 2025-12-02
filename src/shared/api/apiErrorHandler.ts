/**
 * API Error Handler
 *
 * Parses backend error responses and extracts user-facing messages.
 * Backend errors follow the FastAPI HTTPException format:
 * {
 *   "detail": {
 *     "error": "Technical error for logs",
 *     "message": "User-friendly message"
 *   }
 * }
 */

export interface ParsedApiError {
  status: number;
  message: string;
}

/**
 * Parse error response from the backend
 * Expects backend to always provide a message in the response
 */
export async function parseApiErrorResponse(
  response: Response,
): Promise<ParsedApiError> {
  const status = response.status;
  let message = '';

  try {
    const text = await response.text();
    if (!text) return { status, message: 'No error message provided' };

    const data = JSON.parse(text);

    // Extract message from backend error format
    if (data.detail?.message) {
      message = data.detail.message;
    } else if (typeof data.detail === 'string') {
      message = data.detail;
    } else if (data.message) {
      message = data.message;
    } else {
      message = 'No error message provided';
    }
  } catch {
    message = 'Failed to parse error response';
  }

  return { status, message };
}

export function isErrorResponse(response: Response): boolean {
  return !response.ok;
}
