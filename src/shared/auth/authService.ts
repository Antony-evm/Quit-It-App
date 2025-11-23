import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorFactory } from '../error';

// Keys for storing auth data
const AUTH_KEYS = {
  SESSION_JWT: 'session_jwt',
  SESSION_TOKEN: 'session_token',
  USER_ID: 'user_id',
  USER_DATA: 'user_data',
  IS_AUTHENTICATED: 'is_authenticated',
} as const;

/**
 * Secure storage wrapper that uses Keychain for sensitive data and AsyncStorage for non-sensitive data
 */
const secureStorage = {
  // Use Keychain for sensitive tokens
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
      console.error(`Failed to store secure item ${key}:`, error);
      // Fallback to AsyncStorage if Keychain fails
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
      console.error(`Failed to retrieve secure item ${key}:`, error);
      // Fallback to AsyncStorage if Keychain fails
      return await AsyncStorage.getItem(key);
    }
  },

  async removeSecureItem(key: string): Promise<void> {
    try {
      // Use the generic method instead of resetInternetCredentials
      const result = await Keychain.resetGenericPassword({ service: key });
      console.log(`Removed secure item ${key}:`, result);
    } catch (error) {
      console.error(`Failed to remove secure item ${key}:`, error);
      // Fallback to AsyncStorage if Keychain fails
      await AsyncStorage.removeItem(key);
    }
  },

  // Use AsyncStorage for non-sensitive data
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    // Clear sensitive items from Keychain
    const sensitiveKeys = [AUTH_KEYS.SESSION_JWT, AUTH_KEYS.SESSION_TOKEN];
    await Promise.all(sensitiveKeys.map(key => this.removeSecureItem(key)));

    // Clear non-sensitive items from AsyncStorage
    const nonSensitiveKeys = [
      AUTH_KEYS.USER_ID,
      AUTH_KEYS.USER_DATA,
      AUTH_KEYS.IS_AUTHENTICATED,
    ];
    await AsyncStorage.multiRemove(nonSensitiveKeys);
  },
};

export interface AuthTokens {
  sessionJwt: string;
  sessionToken: string;
  userId: string;
}

export interface UserData {
  id: string; // Stytch user ID
  backendUserId?: number; // Backend user ID
  userStatusId?: number; // User status ID from backend
  email?: string;
  phoneNumber?: string;
  name?: string;
  [key: string]: any; // Allow for additional Stytch user properties
}

export class AuthService {
  /**
   * Store authentication tokens securely
   */
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      console.log('[AuthService] Storing tokens...', {
        hasJwt: !!tokens.sessionJwt,
        hasToken: !!tokens.sessionToken,
        hasUserId: !!tokens.userId,
      });

      await Promise.all([
        secureStorage.setSecureItem(AUTH_KEYS.SESSION_JWT, tokens.sessionJwt),
        secureStorage.setSecureItem(
          AUTH_KEYS.SESSION_TOKEN,
          tokens.sessionToken,
        ),
        secureStorage.setItem(AUTH_KEYS.USER_ID, tokens.userId),
        secureStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, 'true'),
      ]);

      console.log('[AuthService] Tokens stored successfully');
    } catch (error) {
      console.error('Failed to store auth tokens:', error);
      throw ErrorFactory.storageError('store auth tokens', error, {
        tokens: {
          ...tokens,
          sessionJwt: '[REDACTED]',
          sessionToken: '[REDACTED]',
        },
      });
    }
  }

  /**
   * Store user data
   */
  static async storeUserData(userData: UserData): Promise<void> {
    try {
      await secureStorage.setItem(
        AUTH_KEYS.USER_DATA,
        JSON.stringify(userData),
      );
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw ErrorFactory.storageError('store user data', error, {
        userId: userData.id,
      });
    }
  }

  /**
   * Get stored JWT token
   */
  static async getSessionJwt(): Promise<string | null> {
    try {
      return await secureStorage.getSecureItem(AUTH_KEYS.SESSION_JWT);
    } catch (error) {
      console.error('Failed to get session JWT:', error);
      throw ErrorFactory.storageError('get session JWT', error);
    }
  }

  /**
   * Get stored session token
   */
  static async getSessionToken(): Promise<string | null> {
    try {
      return await secureStorage.getSecureItem(AUTH_KEYS.SESSION_TOKEN);
    } catch (error) {
      console.error('Failed to get session token:', error);
      throw ErrorFactory.storageError('get session token', error);
    }
  }

  /**
   * Get stored user ID
   */
  static async getUserId(): Promise<string | null> {
    try {
      return await secureStorage.getItem(AUTH_KEYS.USER_ID);
    } catch (error) {
      console.error('Failed to get user ID:', error);
      throw ErrorFactory.storageError('get user ID', error);
    }
  }

  /**
   * Get stored user data
   */
  static async getUserData(): Promise<UserData | null> {
    try {
      const userData = await secureStorage.getItem(AUTH_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      throw ErrorFactory.storageError('get user data', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const isAuth = await secureStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
      const sessionJwt = await secureStorage.getSecureItem(
        AUTH_KEYS.SESSION_JWT,
      );

      // User is authenticated if both flag is set and JWT exists
      return isAuth === 'true' && sessionJwt !== null;
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      throw ErrorFactory.storageError('check authentication status', error);
    }
  }

  /**
   * Get auth tokens for API requests
   */
  static async getAuthTokens(): Promise<AuthTokens | null> {
    try {
      console.log('[AuthService] Retrieving stored tokens...');

      const [sessionJwt, sessionToken, userId] = await Promise.all([
        secureStorage.getSecureItem(AUTH_KEYS.SESSION_JWT),
        secureStorage.getSecureItem(AUTH_KEYS.SESSION_TOKEN),
        secureStorage.getItem(AUTH_KEYS.USER_ID),
      ]);

      console.log('[AuthService] Token retrieval results:', {
        hasJwt: !!sessionJwt,
        hasToken: !!sessionToken,
        hasUserId: !!userId,
      });

      if (!sessionJwt || !sessionToken || !userId) {
        console.log('[AuthService] Missing required tokens, returning null');
        return null;
      }

      console.log('[AuthService] All tokens retrieved successfully');
      return {
        sessionJwt,
        sessionToken,
        userId,
      };
    } catch (error) {
      console.error('Failed to get auth tokens:', error);
      throw ErrorFactory.storageError('get auth tokens', error);
    }
  }

  /**
   * Validate stored session with Stytch
   * Returns user data if session is valid, null if invalid
   */
  static async validateSession(stytchClient?: any): Promise<UserData | null> {
    try {
      const tokens = await this.getAuthTokens();
      const userData = await this.getUserData();

      if (!tokens || !userData) {
        console.log(
          '[AuthService] No tokens or user data found for validation',
        );
        return null;
      }

      if (!stytchClient) {
        console.warn(
          '[AuthService] No Stytch client provided for session validation',
        );
        return userData; // Return stored user data if no validation possible
      }

      // Try to authenticate the session with Stytch
      try {
        const sessionResponse = await stytchClient.session.authenticate({
          session_token: tokens.sessionToken,
          session_duration_minutes: 60,
        });

        if (sessionResponse.status_code === 200) {
          console.log('[AuthService] Session validation successful');
          return userData;
        } else {
          console.log(
            '[AuthService] Session validation failed:',
            sessionResponse.status_code,
          );
          return null;
        }
      } catch (sessionError) {
        console.log('[AuthService] Session validation error:', sessionError);
        return null;
      }
    } catch (error) {
      console.error('Failed to validate session:', error);
      return null;
    }
  }

  /**
   * Check authentication status and validate session
   * Returns the authentication state with session validation
   */
  static async checkAuthenticationWithValidation(stytchClient?: any): Promise<{
    isAuthenticated: boolean;
    isSessionValid: boolean;
    user: UserData | null;
    tokens: AuthTokens | null;
  }> {
    try {
      const [tokens, user] = await Promise.all([
        this.getAuthTokens(),
        this.getUserData(),
      ]);

      if (!tokens || !user) {
        return {
          isAuthenticated: false,
          isSessionValid: false,
          user: null,
          tokens: null,
        };
      }

      // Validate session if Stytch client is available
      const validatedUser = stytchClient
        ? await this.validateSession(stytchClient)
        : user;

      const isSessionValid = validatedUser !== null;

      return {
        isAuthenticated: !!tokens && !!user,
        isSessionValid,
        user: isSessionValid ? user : null,
        tokens: isSessionValid ? tokens : null,
      };
    } catch (error) {
      console.error('Failed to check authentication with validation:', error);
      return {
        isAuthenticated: false,
        isSessionValid: false,
        user: null,
        tokens: null,
      };
    }
  }

  /**
   * Clear all stored authentication data
   */
  static async clearAuth(): Promise<void> {
    try {
      await secureStorage.clear();
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw ErrorFactory.storageError('clear auth data', error);
    }
  }

  /**
   * Logout user by clearing all auth data
   */
  static async logout(): Promise<void> {
    await this.clearAuth();
  }
}

export default AuthService;
