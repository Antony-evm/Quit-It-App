import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens, UserData } from './types';

export const AUTH_KEYS = {
  SESSION_JWT: 'session_jwt',
  SESSION_TOKEN: 'session_token',
  USER_ID: 'user_id',
  USER_DATA: 'user_data',
  IS_AUTHENTICATED: 'is_authenticated',
} as const;

/**
 * Thin storage layer for auth data.
 * - Sensitive values use Keychain, non-sensitive values use AsyncStorage.
 * - Read helpers are intended for startup/bootstrap only.
 */
const secureStorage = {
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
      await AsyncStorage.setItem(key, value);
    }
  },
  async getSecureItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials && typeof credentials !== 'boolean') {
        return credentials.password;
      }
      return null;
    } catch (error) {
      return await AsyncStorage.getItem(key);
    }
  },
  async removeSecureItem(key: string): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      await AsyncStorage.removeItem(key);
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    secureStorage.setSecureItem(AUTH_KEYS.SESSION_JWT, tokens.sessionJwt),
    secureStorage.setSecureItem(AUTH_KEYS.SESSION_TOKEN, tokens.sessionToken),
    secureStorage.setItem(AUTH_KEYS.USER_ID, tokens.userId),
    secureStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, 'true'),
  ]);
}

export async function storeUserData(userData: UserData): Promise<void> {
  await secureStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));
}

export async function readStoredTokens(): Promise<AuthTokens | null> {
  const [sessionJwt, sessionToken, userId] = await Promise.all([
    secureStorage.getSecureItem(AUTH_KEYS.SESSION_JWT),
    secureStorage.getSecureItem(AUTH_KEYS.SESSION_TOKEN),
    secureStorage.getItem(AUTH_KEYS.USER_ID),
  ]);

  if (!sessionJwt || !sessionToken || !userId) {
    return null;
  }

  return {
    sessionJwt,
    sessionToken,
    userId,
  };
}

export async function readStoredUserData(): Promise<UserData | null> {
  const userData = await secureStorage.getItem(AUTH_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
}

export async function clearAuthStorage(): Promise<void> {
  const sensitiveKeys = [AUTH_KEYS.SESSION_JWT, AUTH_KEYS.SESSION_TOKEN];
  const nonSensitiveKeys = [
    AUTH_KEYS.USER_ID,
    AUTH_KEYS.USER_DATA,
    AUTH_KEYS.IS_AUTHENTICATED,
  ];

  await Promise.all(sensitiveKeys.map(key => secureStorage.removeSecureItem(key)));
  await AsyncStorage.multiRemove(nonSensitiveKeys);
}
