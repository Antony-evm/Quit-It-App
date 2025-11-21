import { authenticatedPost, API_BASE_URL } from '@/shared/api/apiConfig';

export interface CreateUserPayload {
  stytch_user_id: string;
  email: string;
  methodology: 'email+password' | 'google' | 'apple' | 'magic_link' | string;
}

export interface CreateUserResponse {
  data: {
    user_id: number;
  };
  success?: boolean;
  message?: string;
}

export interface LoginUserPayload {
  stytch_user_id: string;
  email: string;
  methodology: 'email+password' | 'google' | 'apple' | 'magic_link' | string;
}

export interface LoginUserResponse {
  data: {
    user_id: number;
  };
  success?: boolean;
  message?: string;
}

/**
 * Register a new user with the backend after successful Stytch authentication
 * This version accepts a JWT token directly for new user registration
 */
export const createUser = async (
  payload: CreateUserPayload,
  jwtToken?: string,
): Promise<CreateUserResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If JWT token is provided, use it; otherwise rely on authenticatedPost's automatic JWT inclusion
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  let response: Response;

  if (jwtToken) {
    // Make direct fetch call with provided JWT
    response = await fetch(`${API_BASE_URL}/api/v1/auth/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } else {
    // Use authenticatedPost for existing authenticated users
    response = await authenticatedPost(
      `${API_BASE_URL}/api/v1/auth/create`,
      payload,
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to create user: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();
  return result;
};

/**
 * Login/sync user with the backend after successful Stytch authentication
 * This version accepts a JWT token directly for fresh authentication
 */
export const loginUser = async (
  payload: LoginUserPayload,
  jwtToken?: string,
): Promise<LoginUserResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If JWT token is provided, use it; otherwise rely on authenticatedPost's automatic JWT inclusion
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  let response: Response;

  if (jwtToken) {
    // Make direct fetch call with provided JWT
    response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } else {
    // Use authenticatedPost for existing authenticated users
    response = await authenticatedPost(
      `${API_BASE_URL}/api/v1/auth/login`,
      payload,
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to login user: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();
  return result;
};
