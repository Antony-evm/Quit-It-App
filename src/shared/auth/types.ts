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
  firstName?: string | null; // Individual first name field
  lastName?: string | null; // Individual last name field
  [key: string]: any;
}
