export interface AuthTokens {
  sessionJwt: string;
  sessionToken: string;
  userId: string;
}

export interface UserData {
  id: string; // Stytch user ID
  backendUserId?: number; // Backend user ID
  userStatusId?: number; // User status ID from backend
  email?: string;
  phoneNumber?: string;
  name?: string;
  [key: string]: any;
}
