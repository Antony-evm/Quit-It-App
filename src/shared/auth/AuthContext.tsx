import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useStytch } from '@stytch/react-native';
import AuthService, { type AuthTokens, type UserData } from './authService';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  getBackendUserId: () => number | null;
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

  /**
   * Load authentication state from secure storage
   */
  const loadAuthState = useCallback(async () => {
    try {
      setIsLoading(true);

      const [storedTokens, storedUser] = await Promise.all([
        AuthService.getAuthTokens(),
        AuthService.getUserData(),
      ]);

      if (storedTokens && storedUser) {
        setIsAuthenticated(true);
        setUser(storedUser);
        setTokens(storedTokens);
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user with email and password
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await stytch.passwords.authenticate({
          email: email.trim(),
          password: password,
          session_duration_minutes: 60, // 30 days
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

          // Update state first (but not isAuthenticated yet)
          setUser(userData);
          setTokens(authTokens);

          // Verify tokens were stored correctly before marking as authenticated
          const storedTokens = await AuthService.getAuthTokens();
          if (!storedTokens) {
            throw new Error('Failed to store authentication tokens');
          }

            // Login/sync user with our backend BEFORE marking as authenticated
            try {
              const loginUserPayload: LoginUserPayload = {
                stytch_user_id: user_id,
                email: user.emails?.[0]?.email || email,
                methodology: 'email+password',
              };

              // Use the updated loginUser function (no JWT token needed)
              const backendResponse = await loginUser(loginUserPayload);
              console.log('Backend user login successful:', backendResponse);            // Update user data with backend user_id
            if (backendResponse.data?.user_id) {
              const updatedUserData = {
                ...userData,
                backendUserId: backendResponse.data.user_id,
              };

              await AuthService.storeUserData(updatedUserData);
              setUser(updatedUserData);
            }
          } catch (backendError) {
            console.error('Backend user login failed:', backendError);
            // Don't throw here - user is still authenticated with Stytch
          }

          // NOW mark as authenticated - this will trigger React Query hooks
          // Only do this AFTER backend integration is complete
          setIsAuthenticated(true);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Login error:', error);
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
          session_duration_minutes: 60, // 30 days
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
            phoneNumber: user.phone_numbers?.[0]?.phone_number,
          };

          await Promise.all([
            AuthService.storeTokens(authTokens),
            AuthService.storeUserData(userData),
          ]);

          // Update state first (but not isAuthenticated yet)
          setUser(userData);
          setTokens(authTokens);

          // Verify tokens were stored correctly before marking as authenticated
          const storedTokens = await AuthService.getAuthTokens();
          if (!storedTokens) {
            throw new Error('Failed to store authentication tokens');
          }

            // Register user with our backend BEFORE marking as authenticated
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
              console.log('Backend user creation successful:', backendResponse);            // Update user data with backend user_id
            if (backendResponse.data?.user_id) {
              const updatedUserData = {
                ...userData,
                backendUserId: backendResponse.data.user_id,
              };

              await AuthService.storeUserData(updatedUserData);
              setUser(updatedUserData);
            }
          } catch (backendError) {
            console.error('Backend user creation failed:', backendError);
            // Don't throw here - user is still authenticated with Stytch
            // You might want to show a warning or retry later
          }

          // NOW mark as authenticated - this will trigger React Query hooks
          // Only do this AFTER backend integration is complete
          setIsAuthenticated(true);
        } else {
          throw new Error('Account creation failed');
        }
      } catch (error) {
        console.error('Signup error:', error);
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
        console.warn(
          'Failed to revoke Stytch session (server may be unreachable):',
          stytchError,
        );
        // Continue with local logout even if Stytch revocation fails
      }

      // Clear stored auth data locally
      await AuthService.logout();

      // Update state
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [stytch]);

  /**
   * Refresh authentication state
   */
  const refreshAuthState = useCallback(async () => {
    await loadAuthState();
  }, [loadAuthState]);

  // Helper function to get backend user ID
  const getBackendUserId = useCallback((): number | null => {
    return user?.backendUserId ?? null;
  }, [user]);

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    tokens,
    login,
    signup,
    logout,
    refreshAuthState,
    getBackendUserId,
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
