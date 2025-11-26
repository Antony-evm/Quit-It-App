# User Status Cache Management

## Overview

The application maintains a synchronized cache of user status data to ensure consistent navigation flows and user experience. When user status changes (e.g., after completing questionnaire or subscribing), both the user data in AuthContext and the UserStatusService cache need to be updated.

## Implementation

### Core Components

1. **AuthContext** - Stores user data including `userStatusId`
2. **UserStatusService** - Caches status mappings and navigation actions
3. **useUserStatusUpdate Hook** - Provides consistent status update logic

### Key APIs That Return User Status Updates

- `POST /api/v1/questionnaire/complete` - Returns updated status after questionnaire completion
- `POST /api/v1/subscription` - Returns updated status after subscription
- `GET /api/v1/auth?user_id={id}` - Returns status during login

All these APIs return a `UserDataResponse` containing:
```typescript
{
  data: {
    user_id: number;
    user_status_id: number;
    user_type_id: number;
    first_name: string | null;
    last_name: string | null;
  };
  success?: boolean;
  message?: string;
}
```

## Usage

### Using the Hook

```typescript
import { useUserStatusUpdate } from '@/shared/hooks';

const { handleUserStatusUpdateWithNavigation } = useUserStatusUpdate();

// After API call that returns user status
const response = await someApiCall();
await handleUserStatusUpdateWithNavigation(response, navigation);
```

### What the Hook Does

1. **Updates AuthContext** - Syncs `userStatusId` in user data and persists to storage
2. **Refreshes Status Cache** - Forces UserStatusService to fetch latest status mappings
3. **Handles Navigation** - Executes appropriate navigation based on new status

## Implementation Details

### AuthContext.updateUserStatus()
```typescript
const updateUserStatus = async (newUserStatusId: number) => {
  // Update user data object
  const updatedUserData = { ...user, userStatusId: newUserStatusId };
  
  // Persist to secure storage
  await AuthService.storeUserData(updatedUserData);
  
  // Update in-memory state
  setUser(updatedUserData);
  setAuthState(tokens, updatedUserData);
};
```

### UserStatusService Cache Refresh
```typescript
// Force refresh to get latest status mappings
await UserStatusService.initialize({ forceRefresh: true });

// Execute navigation based on status
UserStatusService.executeStatusAction(user_status_id, navigation);
```

## Status Flow Examples

### Questionnaire Completion
1. User completes questionnaire
2. `POST /api/v1/questionnaire/complete` returns status = "onboarding_complete" 
3. `handleUserStatusUpdateWithNavigation()` updates cache and navigates to Paywall

### Subscription
1. User subscribes 
2. `POST /api/v1/subscription` returns status = "subscribed"
3. `handleUserStatusUpdateWithNavigation()` updates cache and navigates to Home

### Login
1. User logs in
2. `GET /api/v1/auth` returns current status
3. AuthContext updates user data during login flow
4. Navigation handled by existing auth flow

## Benefits

- **Consistency** - Same update logic across all status changes
- **Reliability** - Ensures user data and cache stay synchronized
- **Maintainability** - Centralized status update logic
- **Type Safety** - Consistent use of UserDataResponse interface

## Files Modified

- `src/shared/auth/AuthContext.tsx` - Added `updateUserStatus()` method
- `src/shared/hooks/useUserStatusUpdate.ts` - New centralized hook
- `src/features/questionnaire/screens/QuestionnaireScreen.tsx` - Uses new hook
- `src/features/paywall/screens/PaywallScreen.tsx` - Uses new hook
- `src/shared/hooks/index.ts` - Exports new hook

## Testing

To test the implementation:

1. Complete questionnaire flow and verify navigation to paywall
2. Subscribe and verify navigation to home
3. Check developer menu to confirm user status updates
4. Verify status persists across app restarts

## Future Considerations

- Consider adding status change events/listeners for real-time updates
- Add error recovery for failed status updates
- Consider optimistic updates for better UX
- Add analytics tracking for status transitions