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
  stytchClient: any,
): Promise<BootstrapAuthResult> {
  console.log('[AuthBootstrap] Starting bootstrap');
  const [tokens, user] = await Promise.all([
    readStoredTokens(),
    readStoredUserData(),
  ]);
  console.log('[AuthBootstrap] Loaded from storage - tokens:', !!tokens, 'user:', !!user);

  if (!tokens || !user) {
    console.log('[AuthBootstrap] No tokens/user found - not authenticated');
    return {
      tokens: null,
      user: null,
      isAuthenticated: false,
      isSessionValid: false,
    };
  }

  if (!stytchClient?.session?.authenticate) {
    console.log('[AuthBootstrap] No stytch client - returning invalid session');
    return {
      tokens,
      user,
      isAuthenticated: true,
      isSessionValid: false,
    };
  }

  let isSessionValid = false;

  try {
    console.log('[AuthBootstrap] Validating session with Stytch...');
    const sessionResponse = await stytchClient.session.authenticate({
      session_token: tokens.sessionToken,
      session_duration_minutes: 600,
    });
    console.log('[AuthBootstrap] Session response status:', sessionResponse.status_code);
    isSessionValid = sessionResponse.status_code === 200;
  } catch (error) {
    console.log('[AuthBootstrap] Session validation error:', error);
    isSessionValid = false;
  }

  if (!isSessionValid) {
    console.log('[AuthBootstrap] Session invalid');
    return {
      tokens,
      user,
      isAuthenticated: true,
      isSessionValid: false,
    };
  }

  console.log('[AuthBootstrap] Session valid - returning success');
  return {
    tokens,
    user,
    isAuthenticated: true,
    isSessionValid: true,
  };
}
