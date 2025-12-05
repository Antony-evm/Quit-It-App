import { clearAuthStorage, storeTokens, storeUserData } from './authStorage';
import { AuthTokens, UserData } from './types';
import { StytchClient } from '@stytch/react-native';
import {
  createUser,
  loginUser,
  type CreateUserPayload,
  type LoginUserPayload,
} from '@/features/auth/api';
import { UserAuthenticationMethod } from '@/features/auth/types';

export interface LoginResult {
  tokens: AuthTokens;
  user: UserData;
  userStatusId: number;
}

export interface SignupResult {
  tokens: AuthTokens;
  user: UserData;
  userStatusId: number;
}

/**
 * AuthService handles all authentication business logic including:
 * - Stytch SDK integration
 * - Backend API integration
 * - Token and user data storage
 * - Session management
 */
export class AuthService {
  /**
   * Store auth tokens securely
   */
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    await storeTokens(tokens);
  }

  /**
   * Store user data
   */
  static async storeUserData(userData: UserData): Promise<void> {
    await storeUserData(userData);
  }

  /**
   * Clear all authentication data
   */
  static async clearAuth(): Promise<void> {
    await clearAuthStorage();
  }

  /**
   * Logout - clear auth and revoke session
   */
  static async logout(stytchClient: StytchClient): Promise<void> {
    try {
      await stytchClient.session.revoke();
    } catch (stytchError) {
      // Continue with local logout even if Stytch revocation fails
      console.warn('[AuthService] Stytch session revocation failed:', stytchError);
    }
    await this.clearAuth();
  }

  /**
   * Authenticate user with Stytch and backend
   */
  static async login(
    stytchClient: StytchClient,
    email: string,
    password: string,
  ): Promise<LoginResult> {
    // Step 1: Authenticate with Stytch
    const response = await stytchClient.passwords.authenticate({
      email: email.trim(),
      password: password,
      session_duration_minutes: 600, // 30 days
    });

    if (response.status_code !== 200) {
      throw new Error('Authentication failed');
    }

    const { session_jwt, session_token, user_id, user } = response;

    // Step 2: Create auth tokens
    const authTokens: AuthTokens = {
      sessionJwt: session_jwt,
      sessionToken: session_token,
      userId: user_id,
    };

    // Step 3: Create initial user data
    const userData: UserData = {
      id: user_id,
      email: user.emails?.[0]?.email || email,
    };

    // Step 4: Store tokens and initial user data
    await Promise.all([
      this.storeTokens(authTokens),
      this.storeUserData(userData),
    ]);

    // Step 5: Register/login with backend
    let userStatusId = 0;
    try {
      const loginUserPayload: LoginUserPayload = {
        stytch_user_id: user_id,
      };

      const backendResponse = await loginUser(loginUserPayload);

      if (backendResponse.data?.user_id) {
        userStatusId = backendResponse.data.user_status_id || 0;
        const updatedUserData: UserData = {
          ...userData,
          backendUserId: backendResponse.data.user_id,
          userStatusId: userStatusId,
          firstName: backendResponse.data.first_name,
          lastName: backendResponse.data.last_name,
          ...(backendResponse.data.first_name || backendResponse.data.last_name
            ? {
                name: [
                  backendResponse.data.first_name,
                  backendResponse.data.last_name,
                ]
                  .filter(Boolean)
                  .join(' '),
              }
            : {}),
        };

        await this.storeUserData(updatedUserData);
        return { tokens: authTokens, user: updatedUserData, userStatusId };
      }
    } catch (backendError) {
      console.warn('[AuthService] Backend login failed:', backendError);
      // Continue with Stytch auth even if backend fails
    }

    return { tokens: authTokens, user: userData, userStatusId };
  }

  /**
   * Sign up user with Stytch and backend
   */
  static async signup(
    stytchClient: StytchClient,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<SignupResult> {
    // Step 1: Create account with Stytch
    const response = await stytchClient.passwords.create({
      email: email.trim(),
      password: password,
      session_duration_minutes: 600, // 30 days
    });

    if (response.status_code !== 200) {
      throw new Error('Account creation failed');
    }

    const { session_jwt, session_token, user_id, user } = response;

    // Step 2: Create auth tokens
    const authTokens: AuthTokens = {
      sessionJwt: session_jwt,
      sessionToken: session_token,
      userId: user_id,
    };

    // Step 3: Create user data with names
    const userData: UserData = {
      id: user_id,
      email: user.emails?.[0]?.email || email,
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
    };

    // Step 4: Store tokens and user data
    await Promise.all([
      this.storeTokens(authTokens),
      this.storeUserData(userData),
    ]);

    // Step 5: Register with backend
    let userStatusId = 0;
    try {
      const createUserPayload: CreateUserPayload = {
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        email: user.emails?.[0]?.email || email,
        stytch_user_id: user_id,
        user_authentication_method: UserAuthenticationMethod.EMAIL_PASSWORD,
      };

      const backendResponse = await createUser(createUserPayload);

      if (backendResponse.data?.user_id) {
        userStatusId = backendResponse.data.user_status_id || 0;
        const updatedUserData: UserData = {
          ...userData,
          backendUserId: backendResponse.data.user_id,
          userStatusId: userStatusId,
          firstName: backendResponse.data.first_name,
          lastName: backendResponse.data.last_name,
          ...(backendResponse.data.first_name || backendResponse.data.last_name
            ? {
                name: [
                  backendResponse.data.first_name,
                  backendResponse.data.last_name,
                ]
                  .filter(Boolean)
                  .join(' '),
              }
            : {}),
        };

        await this.storeUserData(updatedUserData);
        return { tokens: authTokens, user: updatedUserData, userStatusId };
      }
    } catch (backendError) {
      console.warn('[AuthService] Backend user creation failed:', backendError);
      // User is still authenticated with Stytch
    }

    return { tokens: authTokens, user: userData, userStatusId };
  }

  /**
   * Update user data with information from backend
   */
  static async updateUserData(
    currentUser: UserData,
    currentTokens: AuthTokens,
    updates: {
      user_status_id: number;
      first_name?: string | null;
      last_name?: string | null;
      user_id?: number;
      user_type_id?: number;
    },
  ): Promise<UserData> {
    const updatedUserData: UserData = {
      ...currentUser,
      userStatusId: updates.user_status_id,
      firstName: updates.first_name,
      lastName: updates.last_name,
      ...(updates.first_name || updates.last_name
        ? {
            name: [updates.first_name, updates.last_name]
              .filter(Boolean)
              .join(' '),
          }
        : {}),
      ...(updates.user_id ? { backendUserId: updates.user_id } : {}),
    };

    await this.storeUserData(updatedUserData);
    return updatedUserData;
  }

  /**
   * Update user status
   */
  static async updateUserStatus(
    currentUser: UserData,
    newUserStatusId: number,
  ): Promise<UserData> {
    const updatedUserData: UserData = {
      ...currentUser,
      userStatusId: newUserStatusId,
    };

    await this.storeUserData(updatedUserData);
    return updatedUserData;
  }
}

export default AuthService;
