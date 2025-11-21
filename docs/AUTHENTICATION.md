# Authentication System Documentation

This document explains how the secure authentication system works in the Quit-It App.

## Overview

The app now uses a secure authentication system that stores both JWT and session tokens from Stytch authentication. The tokens are stored securely using platform-specific secure storage solutions.

## Key Components

### 1. AuthService (`src/shared/auth/authService.ts`)

A utility class that handles secure storage of authentication tokens and user data:

- **Token Storage**: Stores `session_jwt`, `session_token`, and `user_id` securely
- **Platform Support**: Uses `expo-secure-store` on iOS/Android, falls back to `AsyncStorage` on web
- **User Data**: Stores complete user profile information
- **Authentication Status**: Tracks if user is authenticated

Key methods:

```typescript
await AuthService.storeTokens(tokens);
await AuthService.storeUserData(userData);
await AuthService.isAuthenticated();
await AuthService.getAuthTokens();
await AuthService.clearAuth();
```

### 2. AuthContext (`src/shared/auth/AuthContext.tsx`)

React context that provides authentication state and methods throughout the app:

- **State Management**: Tracks authentication status, user data, and tokens
- **Login/Signup**: Handles authentication with Stytch
- **Auto-loading**: Loads authentication state from secure storage on app start

Usage:

```typescript
const { isAuthenticated, user, login, signup, logout } = useAuth();
```

### 3. Authenticated API Requests (`src/shared/api/authenticatedFetch.ts`)

Utility functions for making API requests with automatic token inclusion:

- **Auto-authentication**: Automatically includes JWT/session token in requests
- **Token Management**: Handles token expiration and cleanup
- **Convenience Methods**: Provides GET, POST, PUT, DELETE helpers

Usage:

```typescript
import { authenticatedPost, authenticatedGet } from '@/shared/api/apiConfig';

// Automatically includes Authorization header with JWT
const response = await authenticatedPost('/api/v1/tracking', payload);
const data = await authenticatedGet('/api/v1/user/profile');
```

## Token Types Explained

**Important**: Both `session_jwt` and `session_token` from Stytch are access tokens, not a refresh token pair:

- **session_jwt**: JWT format token (can be decoded to read claims)
- **session_token**: Opaque token format (cannot be decoded)
- **Both represent the same session** in different formats
- **Stytch handles token refresh automatically** through their SDK

## Security Features

1. **Secure Storage**: Tokens stored in device keychain (iOS) or encrypted storage (Android)
2. **Automatic Cleanup**: Tokens cleared on logout or authentication failure
3. **Token Validation**: Checks token existence for authentication status
4. **Platform Fallback**: Gracefully falls back to AsyncStorage on unsupported platforms

## Usage Examples

### Basic Authentication Flow

```typescript
// Login
try {
  await login(email, password);
  // User is now authenticated, tokens stored securely
  navigation.navigate('Home');
} catch (error) {
  Alert.alert('Error', 'Login failed');
}

// Check if user is authenticated
const { isAuthenticated, user } = useAuth();
if (isAuthenticated) {
  console.log('User logged in:', user.email);
}

// Logout
await logout();
// All tokens and user data cleared
```

### Making Authenticated API Calls

```typescript
import { authenticatedPost } from '@/shared/api/apiConfig';

// Create tracking record with automatic authentication
const createRecord = async data => {
  try {
    const response = await authenticatedPost('/api/v1/tracking', data);
    const result = await response.json();
    return result;
  } catch (error) {
    if (error.message.includes('Authentication failed')) {
      // Token expired, redirect to login
      navigation.navigate('Auth');
    }
    throw error;
  }
};
```

### Accessing Current User Data

```typescript
const { user } = useAuth();

// User object contains:
console.log(user.id); // Stytch user ID
console.log(user.email); // User's email
console.log(user.name); // User's name (if provided)
console.log(user.phoneNumber); // Phone number (if provided)
```

## Migration Guide

If you're updating existing API calls to use authentication:

1. **Replace fetch calls**:

   ```typescript
   // Before
   const response = await fetch('/api/endpoint', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
   });

   // After
   const response = await authenticatedPost('/api/endpoint', data);
   ```

2. **Update components to use auth context**:

   ```typescript
   // Before
   const [user, setUser] = useState(null);

   // After
   const { user, isAuthenticated } = useAuth();
   ```

3. **Handle authentication errors**:
   ```typescript
   try {
     const response = await authenticatedGet('/api/user/profile');
     const userData = await response.json();
   } catch (error) {
     if (error.message.includes('Authentication failed')) {
       // Redirect to login screen
     }
   }
   ```

## Backend Integration

When your backend receives requests, it will have these headers:

```
Authorization: Bearer <jwt_token_here>
X-User-ID: <user_id_here>
Content-Type: application/json
```

You can verify the JWT using Stytch's verification endpoints or libraries.
