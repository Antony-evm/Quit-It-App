import { clearAuthStorage, storeTokens, storeUserData } from './authStorage';
import { AuthTokens, UserData } from './types';

/**
 * AuthService now only writes/clears auth data.
 * Reading is handled during startup bootstrap.
 */
export class AuthService {
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    await storeTokens(tokens);
  }

  static async storeUserData(userData: UserData): Promise<void> {
    await storeUserData(userData);
  }

  static async clearAuth(): Promise<void> {
    await clearAuthStorage();
  }

  static async logout(): Promise<void> {
    await this.clearAuth();
  }
}

export default AuthService;
