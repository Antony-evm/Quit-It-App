import React, { createContext, useContext, useState, useCallback } from 'react';
import { useStytch } from '@stytch/react-native';
import AuthService from './authService';
import { clearAuthState, setAuthState } from './authState';
import { type AuthTokens, type UserData } from './types';

import {
  createUser,
  loginUser,
  type CreateUserPayload,
  type LoginUserPayload,
} from '@/features/auth/api';
import { UserAuthenticationMethod } from '@/features/auth/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  tokens: AuthTokens | null;
  initializeFromBootstrap: (state: {
    tokens: AuthTokens | null;
    user: UserData | null;
  }) => void;
  login: (email: string, password: string) => Promise<{ userStatusId: number }>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ userStatusId: number }>;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  getBackendUserId: () => number | null;
  updateUserStatus: (newUserStatusId: number) => Promise<void>;
  updateUserData: (userData: {
    user_status_id: number;
    first_name?: string | null;
    last_name?: string | null;
    user_id?: number;
    user_type_id?: number;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  const stytch = useStytch();

  const initializeFromBootstrap = useCallback(
    ({
      tokens: bootstrapTokens,
      user: bootstrapUser,
    }: {
      tokens: AuthTokens | null;
      user: UserData | null;
    }) => {
      setTokens(bootstrapTokens);
      setUser(bootstrapUser);
      setAuthState(bootstrapTokens, bootstrapUser);
      setIsAuthenticated(!!bootstrapTokens && !!bootstrapUser);
      setIsLoading(false);
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await stytch.passwords.authenticate({
          email: email.trim(),
          password: password,
          session_duration_minutes: 600, // 30 days
        });

        if (response.status_code === 200) {
          const { session_jwt, session_token, user_id, user } = response;

          const authTokens: AuthTokens = {
            sessionJwt: session_jwt,
            sessionToken: session_token,
            userId: user_id,
          };

          const userData: UserData = {
            id: user_id,
            email: user.emails?.[0]?.email || email,
            name:
              user.name?.first_name ||
              user.name?.middle_name ||
              user.name?.last_name
                ? `${user.name.first_name || ''} ${
                    user.name.last_name || ''
                  }`.trim()
                : undefined,
            phoneNumber: user.phone_numbers?.[0]?.phone_number,
          };

          await Promise.all([
            AuthService.storeTokens(authTokens),
            AuthService.storeUserData(userData),
          ]);

          setUser(userData);
          setTokens(authTokens);
          setAuthState(authTokens, userData);

          let userStatusId = 0;
          try {
            const loginUserPayload: LoginUserPayload = {
              stytch_user_id: user_id,
              email: user.emails?.[0]?.email || email,
              methodology: 'email+password',
            };

            const backendResponse = await loginUser(loginUserPayload);

            if (backendResponse.data?.user_id) {
              userStatusId = backendResponse.data.user_status_id || 0;
              const updatedUserData = {
                ...userData,
                backendUserId: backendResponse.data.user_id,
                userStatusId: userStatusId,
              };

              await AuthService.storeUserData(updatedUserData);
              setUser(updatedUserData);
              setAuthState(authTokens, updatedUserData);
            }
          } catch (backendError) {
            // Backend user login failed
          }

          setIsAuthenticated(true);

          return { userStatusId };
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        throw error;
      }
    },
    [stytch],
  );

  /**
   * Sign up user with email and password
   */
  const signup = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      try {
        const response = await stytch.passwords.create({
          email: email.trim(),
          password: password,
          session_duration_minutes: 600, // 30 days
        });

        if (response.status_code === 200) {
          const { session_jwt, session_token, user_id, user } = response;

          // Store tokens securely
          const authTokens: AuthTokens = {
            sessionJwt: session_jwt,
            sessionToken: session_token,
            userId: user_id,
          };

          const userData: UserData = {
            id: user_id,
            email: user.emails?.[0]?.email || email,
            name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            firstName: firstName.trim() || null,
            lastName: lastName.trim() || null,
            phoneNumber: user.phone_numbers?.[0]?.phone_number,
          };

          await Promise.all([
            AuthService.storeTokens(authTokens),
            AuthService.storeUserData(userData),
          ]);

          // Update in-memory and context state
          setUser(userData);
          setTokens(authTokens);
          setAuthState(authTokens, userData);

          // Register user with our backend BEFORE marking as authenticated
          let userStatusId = 0;
          try {
            const createUserPayload: CreateUserPayload = {
              first_name: firstName.trim() || null,
              last_name: lastName.trim() || null,
              email: user.emails?.[0]?.email || email,
              stytch_user_id: user_id,
              user_authentication_method:
                UserAuthenticationMethod.EMAIL_PASSWORD,
            };

            // Use the updated createUser function (no JWT token needed)
            const backendResponse = await createUser(createUserPayload);

            // Update user data with backend user_id and user_status_id
            if (backendResponse.data?.user_id) {
              userStatusId = backendResponse.data.user_status_id || 0;
              const updatedUserData = {
                ...userData,
                backendUserId: backendResponse.data.user_id,
                userStatusId: userStatusId,
                // Update with backend's version of the names (they might be different)
                firstName: backendResponse.data.first_name,
                lastName: backendResponse.data.last_name,
                // Update combined name if we have names from backend
                ...(backendResponse.data.first_name ||
                backendResponse.data.last_name
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

              await AuthService.storeUserData(updatedUserData);
              setUser(updatedUserData);
              setAuthState(authTokens, updatedUserData);
            }
          } catch (backendError) {
            // Don't throw here - user is still authenticated with Stytch
            // You might want to show a warning or retry later
          }

          // NOW mark as authenticated - this will trigger React Query hooks
          // Only do this AFTER backend integration is complete
          setIsAuthenticated(true);

          return { userStatusId };
        } else {
          throw new Error('Account creation failed');
        }
      } catch (error) {
        throw error;
      }
    },
    [stytch],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      // First try to revoke the session on Stytch servers
      try {
        await stytch.session.revoke();
      } catch (stytchError) {
        // Continue with local logout even if Stytch revocation fails
      }

      // Clear stored auth data locally
      await AuthService.logout();

      // Update state
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
      clearAuthState();
      setIsLoading(false);
    } catch (error) {
      throw error;
    }
  }, [stytch]);

  /**
   * Refresh authentication state
   */
  const refreshAuthState = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
    clearAuthState();
    setIsLoading(false);
  }, []);

  // Helper function to get backend user ID
  const getBackendUserId = useCallback((): number | null => {
    return user?.backendUserId ?? null;
  }, [user]);

  /**
   * Update user status when new status data arrives from backend
   */
  const updateUserStatus = useCallback(
    async (newUserStatusId: number) => {
      if (!user) {
        console.warn('[Auth] Cannot update user status - no user data');
        return;
      }

      try {
        const updatedUserData = {
          ...user,
          userStatusId: newUserStatusId,
        };

        // Update stored user data
        await AuthService.storeUserData(updatedUserData);

        // Update in-memory state
        setUser(updatedUserData);

        // Update auth state
        if (tokens) {
          setAuthState(tokens, updatedUserData);
        }

        console.log('[Auth] User status updated to:', newUserStatusId);
      } catch (error) {
        console.error('[Auth] Failed to update user status:', error);
      }
    },
    [user, tokens],
  );

  /**
   * Update user data with complete information from backend API response
   */
  const updateUserData = useCallback(
    async (userData: {
      user_status_id: number;
      first_name?: string | null;
      last_name?: string | null;
      user_id?: number;
      user_type_id?: number;
    }) => {
      if (!user) {
        console.warn('[Auth] Cannot update user data - no user data');
        return;
      }

      try {
        const updatedUserData = {
          ...user,
          userStatusId: userData.user_status_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          // Update combined name field if we have first/last names
          ...(userData.first_name || userData.last_name
            ? {
                name: [userData.first_name, userData.last_name]
                  .filter(Boolean)
                  .join(' '),
              }
            : {}),
          // Update backend user ID if provided
          ...(userData.user_id ? { backendUserId: userData.user_id } : {}),
        };

        // Update stored user data
        await AuthService.storeUserData(updatedUserData);

        // Update in-memory state
        setUser(updatedUserData);

        // Update auth state
        if (tokens) {
          setAuthState(tokens, updatedUserData);
        }

        console.log('[Auth] User data updated:', {
          userStatusId: userData.user_status_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
        });
      } catch (error) {
        console.error('[Auth] Failed to update user data:', error);
      }
    },
    [user, tokens],
  );

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    tokens,
    initializeFromBootstrap,
    login,
    signup,
    logout,
    refreshAuthState,
    getBackendUserId,
    updateUserStatus,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
