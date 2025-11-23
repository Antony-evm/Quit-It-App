import { readStoredTokens, readStoredUserData } from './authStorage';
import { AuthTokens, UserData } from './types';

export interface BootstrapAuthResult {
  tokens: AuthTokens | null;
  user: UserData | null;
  isAuthenticated: boolean;
  isSessionValid: boolean;
}

/**
 * Read auth state from storage and optionally validate the session with Stytch.
 * Intended to be called once on startup.
 */
export async function bootstrapAuthState(
  stytchClient?: any,
): Promise<BootstrapAuthResult> {
  const [tokens, user] = await Promise.all([
    readStoredTokens(),
    readStoredUserData(),
  ]);

  if (!tokens || !user) {
    return {
      tokens: null,
      user: null,
      isAuthenticated: false,
      isSessionValid: false,
    };
  }

  // Default to valid if we cannot validate
  let isSessionValid = true;

  if (stytchClient) {
    try {
      const sessionResponse = await stytchClient.session.authenticate({
        session_token: tokens.sessionToken,
        session_duration_minutes: 60,
      });
      isSessionValid = sessionResponse.status_code === 200;
    } catch (error) {
      console.log('[AuthBootstrap] Session validation error:', error);
      isSessionValid = false;
    }
  }

  if (!isSessionValid) {
    return {
      tokens,
      user,
      isAuthenticated: true,
      isSessionValid: false,
    };
  }

  return {
    tokens,
    user,
    isAuthenticated: true,
    isSessionValid: true,
  };
}
