export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
}

export interface LoginData {
  email?: string;
  phoneNumber?: string;
}
