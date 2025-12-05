import { useState, useCallback } from 'react';
import { useStytch } from '@stytch/react-native';
import AuthService from './authService';
import { clearAuthState, setAuthState } from './authState';
import { type AuthTokens, type UserData } from './types';
import { resetNavigation } from '@/navigation/navigationRef';
import { clearQueryCache } from '@/shared/api/queryClient';

export interface UseAuthProviderResult {
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

/**
 * Hook that encapsulates all authentication logic.
 * Separates business logic from the context provider.
 */
export const useAuthProvider = (): UseAuthProviderResult => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  const stytch = useStytch();

  /**
   * Initialize auth state from bootstrap process
   */
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

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (email: string, password: string): Promise<{ userStatusId: number }> => {
      try {
        const result = await AuthService.login(stytch, email, password);

        setUser(result.user);
        setTokens(result.tokens);
        setAuthState(result.tokens, result.user);
        setIsAuthenticated(true);

        return { userStatusId: result.userStatusId };
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
    ): Promise<{ userStatusId: number }> => {
      try {
        const result = await AuthService.signup(
          stytch,
          email,
          password,
          firstName,
          lastName,
        );

        setUser(result.user);
        setTokens(result.tokens);
        setAuthState(result.tokens, result.user);
        setIsAuthenticated(true);

        return { userStatusId: result.userStatusId };
      } catch (error) {
        throw error;
      }
    },
    [stytch],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await AuthService.logout(stytch);

      // Clear all React Query cached data
      clearQueryCache();

      // Update state
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
      clearAuthState();
      setIsLoading(false);

      // Navigate to login screen
      resetNavigation('Auth', { mode: 'login' });
    } catch (error) {
      throw error;
    }
  }, [stytch]);

  /**
   * Refresh authentication state (clear current state)
   */
  const refreshAuthState = useCallback(async (): Promise<void> => {
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
    clearAuthState();
    setIsLoading(false);
  }, []);

  /**
   * Get backend user ID
   */
  const getBackendUserId = useCallback((): number | null => {
    return user?.backendUserId ?? null;
  }, [user]);

  /**
   * Update user status when new status data arrives from backend
   */
  const updateUserStatus = useCallback(
    async (newUserStatusId: number): Promise<void> => {
      if (!user) {
        return;
      }

      try {
        const updatedUserData = await AuthService.updateUserStatus(
          user,
          newUserStatusId,
        );

        setUser(updatedUserData);

        if (tokens) {
          setAuthState(tokens, updatedUserData);
        }
      } catch (error) {
        console.error('[useAuthProvider] Failed to update user status:', error);
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
    }): Promise<void> => {
      if (!user || !tokens) {
        return;
      }

      try {
        const updatedUserData = await AuthService.updateUserData(
          user,
          tokens,
          userData,
        );

        setUser(updatedUserData);
        setAuthState(tokens, updatedUserData);
      } catch (error) {
        console.error('[useAuthProvider] Failed to update user data:', error);
      }
    },
    [user, tokens],
  );

  return {
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
};
