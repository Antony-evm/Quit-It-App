# Backend User ID Integration

## Overview

Updated the authentication system to use the backend user ID (`{data: {user_id: number}}`) returned from signup/login endpoints for all API requests that require a user identifier.

## Key Changes

### 1. AuthContext Updates

- **Enhanced signup/login flow** to capture and store backend `user_id` from API responses
- **Added `getBackendUserId()`** method to retrieve the backend user ID
- **Updated UserData interface** to include `backendUserId?: number`
- **Automatic storage** of backend user ID after successful authentication

### 2. API Response Interface Updates

```typescript
// Updated interfaces to match backend response format
export interface CreateUserResponse {
  data: {
    user_id: number;
  };
  success?: boolean;
  message?: string;
}

export interface LoginUserResponse {
  data: {
    user_id: number;
  };
  success?: boolean;
  message?: string;
}
```

### 3. Utility Hooks

- **`useBackendUserId()`**: Returns backend user ID, throws error if not available
- **`useBackendUserIdSafe()`**: Returns backend user ID or null if not available
- **Updated `useCurrentUserId()`**: Now prioritizes backend user ID over Stytch user ID

### 4. Updated Components

- **Questionnaire system**: Now uses backend user ID for answer submissions
- **Tracking system**: Now uses backend user ID for all tracking operations
- **Notes and tracking forms**: Automatically use correct backend user ID

## Authentication Flow

### Signup Process

1. User creates account with Stytch (first name, last name, email, password)
2. Stytch returns `session_jwt`, `session_token`, and Stytch `user_id`
3. App calls backend `/api/v1/auth/create` with fresh JWT and user details
4. Backend returns `{data: {user_id: backend_user_id}}`
5. App stores both Stytch user data AND backend user ID
6. All subsequent API calls use backend user ID

### Login Process

1. User authenticates with Stytch
2. Stytch returns authentication tokens
3. App calls backend `/api/v1/auth/login` with fresh JWT
4. Backend returns `{data: {user_id: backend_user_id}}`
5. App updates stored user data with backend user ID
6. All subsequent API calls use backend user ID

## Usage Examples

### In Components

```typescript
import { useBackendUserId } from '@/shared/hooks';

const MyComponent = () => {
  const backendUserId = useBackendUserId(); // Will throw if not available

  // Use backendUserId in API calls
  const payload = {
    user_id: backendUserId,
    // other data...
  };
};
```

### Safe Usage

```typescript
import { useBackendUserIdSafe } from '@/shared/hooks';

const MyComponent = () => {
  const backendUserId = useBackendUserIdSafe(); // Returns null if not available

  if (!backendUserId) {
    return <LoginPrompt />;
  }

  // Use backendUserId safely
};
```

### Existing Components (No Changes Needed)

```typescript
// These automatically use backend user ID now:
import { useCurrentUserId } from '@/features/tracking/hooks/useCurrentUserId';
const userId = useCurrentUserId(); // Returns backend user ID
```

## Data Storage

### UserData Structure

```typescript
interface UserData {
  id: string; // Stytch user ID (string)
  backendUserId?: number; // Backend user ID (number) - NEW
  email?: string;
  phoneNumber?: string;
  name?: string;
  [key: string]: any;
}
```

### Storage Flow

1. **Stytch authentication** provides string user ID and user details
2. **Backend authentication** provides numeric user ID
3. **Both IDs stored** in secure storage
4. **API calls use backend ID** for user identification
5. **Stytch ID used** for Stytch-specific operations

## Benefits

### ✅ Consistent User Identification

- All backend API calls now use the correct backend user ID
- No more mismatched user IDs between frontend and backend

### ✅ Secure Authentication

- Fresh JWT tokens used for initial backend registration
- Proper token handling for new vs existing users

### ✅ Backward Compatibility

- Existing components work without changes
- Graceful fallbacks for development/testing

### ✅ Type Safety

- TypeScript interfaces ensure correct API usage
- Clear distinction between Stytch ID (string) and Backend ID (number)

## Migration Notes

### Updated Files

- ✅ `AuthContext.tsx` - Added backend user ID handling
- ✅ `authService.ts` - Updated UserData interface
- ✅ `createUser.ts` - Updated API interfaces and JWT handling
- ✅ `useCurrentUserId.ts` - Now returns backend user ID
- ✅ `useQuestionnaire.ts` - Uses backend user ID automatically

### No Changes Needed

- 🔄 Existing components using `useCurrentUserId()` work automatically
- 🔄 API calls using `authenticatedFetch` work as expected
- 🔄 Form components continue working without modifications

## Testing

### What to Test

1. **Signup flow**: Verify backend user ID is captured and stored
2. **Login flow**: Verify backend user ID is retrieved and updated
3. **API calls**: Ensure tracking/questionnaire APIs use correct user ID
4. **Error handling**: Test behavior when backend user ID is not available

### Expected Behavior

- New signups should store both Stytch ID and backend ID
- Existing users should get backend ID populated on next login
- All tracking/questionnaire operations use backend user ID
- Clear error messages if backend user ID is missing
