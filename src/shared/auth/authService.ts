import { ErrorFactory } from '../error';
import {
  clearAuthStorage,
  storeTokens,
  storeUserData,
} from './authStorage';
import { AuthTokens, UserData } from './types';

/**
 * AuthService now only writes/clears auth data.
 * Reading is handled during startup bootstrap.
 */
export class AuthService {
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      console.log('[AuthService] Storing authentication tokens...');
      await storeTokens(tokens);
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

  static async storeUserData(userData: UserData): Promise<void> {
    try {
      await storeUserData(userData);
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw ErrorFactory.storageError('store user data', error, {
        userId: userData.id,
      });
    }
  }

  static async clearAuth(): Promise<void> {
    try {
      await clearAuthStorage();
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw ErrorFactory.storageError('clear auth data', error);
    }
  }

  static async logout(): Promise<void> {
    await this.clearAuth();
  }
}

export default AuthService;
