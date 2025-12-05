import React, { createContext, useContext } from 'react';
import { type AuthTokens, type UserData } from './types';
import { useAuthProvider, type UseAuthProviderResult } from './useAuthProvider';

/**
 * Auth context type - provides authentication state and actions
 */
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

/**
 * Pure context provider - all logic delegated to useAuthProvider hook
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const value = useAuthProvider();

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
