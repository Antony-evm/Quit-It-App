import { AuthTokens, UserData } from './types';

let currentTokens: AuthTokens | null = null;
let currentUser: UserData | null = null;

export function setAuthState(tokens: AuthTokens | null, user: UserData | null) {
  currentTokens = tokens;
  currentUser = user;
}

export function setTokens(tokens: AuthTokens | null) {
  currentTokens = tokens;
}

export function setUser(user: UserData | null) {
  currentUser = user;
}

export function clearAuthState() {
  currentTokens = null;
  currentUser = null;
}

export function getTokens() {
  return currentTokens;
}

export function getUser() {
  return currentUser;
}
