import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing auth data
const AUTH_KEYS = {
  SESSION_JWT: 'session_jwt',
  SESSION_TOKEN: 'session_token',
  USER_ID: 'user_id',
  USER_DATA: 'user_data',
  IS_AUTHENTICATED: 'is_authenticated',
} as const;

/**
 * Storage wrapper that uses AsyncStorage for simplicity and reliability
 * Note: For production apps, consider using react-native-keychain for additional security
 */
const secureStorage = {
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
    const keys = Object.values(AUTH_KEYS);
    await AsyncStorage.multiRemove(keys);
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
      await Promise.all([
        secureStorage.setItem(AUTH_KEYS.SESSION_JWT, tokens.sessionJwt),
        secureStorage.setItem(AUTH_KEYS.SESSION_TOKEN, tokens.sessionToken),
        secureStorage.setItem(AUTH_KEYS.USER_ID, tokens.userId),
        secureStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, 'true'),
      ]);
    } catch (error) {
      console.error('Failed to store auth tokens:', error);
      throw new Error('Failed to store authentication tokens');
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
      throw new Error('Failed to store user data');
    }
  }

  /**
   * Get stored JWT token
   */
  static async getSessionJwt(): Promise<string | null> {
    try {
      return await secureStorage.getItem(AUTH_KEYS.SESSION_JWT);
    } catch (error) {
      console.error('Failed to get session JWT:', error);
      return null;
    }
  }

  /**
   * Get stored session token
   */
  static async getSessionToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(AUTH_KEYS.SESSION_TOKEN);
    } catch (error) {
      console.error('Failed to get session token:', error);
      return null;
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
      return null;
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
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const isAuth = await secureStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
      const sessionJwt = await secureStorage.getItem(AUTH_KEYS.SESSION_JWT);

      // User is authenticated if both flag is set and JWT exists
      return isAuth === 'true' && sessionJwt !== null;
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      return false;
    }
  }

  /**
   * Get auth tokens for API requests
   */
  static async getAuthTokens(): Promise<AuthTokens | null> {
    try {
      const [sessionJwt, sessionToken, userId] = await Promise.all([
        secureStorage.getItem(AUTH_KEYS.SESSION_JWT),
        secureStorage.getItem(AUTH_KEYS.SESSION_TOKEN),
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
    } catch (error) {
      console.error('Failed to get auth tokens:', error);
      return null;
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
      throw new Error('Failed to clear authentication data');
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
