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
      await storeTokens(tokens);
      } catch (error) {
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
      throw ErrorFactory.storageError('store user data', error, {
        userId: userData.id,
      });
    }
  }

  static async clearAuth(): Promise<void> {
    try {
      await clearAuthStorage();
    } catch (error) {
      throw ErrorFactory.storageError('clear auth data', error);
    }
  }

  static async logout(): Promise<void> {
    await this.clearAuth();
  }
}

export default AuthService;
