# Authentication-Gated API Calls

## Overview

Updated all API hooks to only execute after user authentication to prevent unauthorized API calls and improve app security.

## Changes Made

### 🔐 **Updated Tracking Hooks**

#### 1. `useTrackingTypes`

- **What**: Hook for fetching tracking type definitions
- **API**: `GET /api/v1/tracking/types` (uses `authenticatedGet`)
- **Change**: Added `enabled: isAuthenticated` to only fetch after login
- **Impact**: Tracking type dropdowns won't populate until user is authenticated

#### 2. `useInfiniteTrackingRecords`

- **What**: Hook for fetching paginated tracking records
- **API**: `GET /api/v1/tracking` (uses `authenticatedGet`)
- **Change**: Modified `enabled: enabled && isAuthenticated`
- **Impact**: Tracking history won't load until user is authenticated

#### 3. `useTrackingRecords`

- **What**: Hook for fetching tracking records with offset
- **API**: `GET /api/v1/tracking` (uses `authenticatedGet`)
- **Change**: Modified `enabled: enabled && isAuthenticated`
- **Impact**: Tracking records queries wait for authentication

### 📝 **Updated Questionnaire Hook**

#### `useQuestionnaire`

- **What**: Hook for fetching questionnaire questions
- **API**: `GET /api/v1/questionnaire` (uses `authenticatedGet`)
- **Change**: Modified `enabled: !isReviewing && isAuthenticated`
- **Impact**: Questionnaire questions won't load until user is authenticated

## Technical Implementation

### Before (Problematic)

```typescript
// API calls would execute immediately on component mount
const { data: trackingTypes } = useTrackingTypes();
// ❌ This could fail with 401/403 if user not authenticated yet
```

### After (Secure)

```typescript
// API calls wait for authentication
const { isAuthenticated } = useAuth();
const { data: trackingTypes } = useTrackingTypes();
// ✅ This only executes after isAuthenticated === true
```

### Implementation Pattern

```typescript
import { useAuth } from '@/shared/auth';

export const useApiHook = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['someData'],
    queryFn: fetchSomeData,
    enabled: isAuthenticated, // 🔑 Key addition
    // ... other options
  });
};
```

## Authentication Flow

### 1. App Startup

```
📱 App launches
🔄 AuthContext checks for stored credentials
❌ isAuthenticated = false (initially)
🚫 API hooks are disabled (enabled: false)
```

### 2. User Login/Signup

```
👤 User completes authentication
✅ Stytch authentication succeeds
🔑 JWT tokens stored
✅ isAuthenticated = true
🚀 All API hooks automatically enabled
📊 Data begins fetching
```

### 3. Component Behavior

```
🔄 Components mount with useAuth checks
⏳ Loading states shown while authentication pending
✅ Data fetches once authenticated
📱 UI populates with user data
```

## Benefits

### ✅ **Security**

- No unauthorized API calls to backend
- Prevents 401/403 errors on app startup
- JWT tokens only used when valid

### ✅ **Performance**

- No wasted API calls before authentication
- Cleaner loading states
- Better error handling

### ✅ **User Experience**

- Smoother authentication flow
- No confusing error states
- Predictable data loading

### ✅ **Developer Experience**

- Centralized authentication logic
- Consistent pattern across hooks
- Easy to reason about data flow

## Updated Files

### Core Hooks

- ✅ `src/features/tracking/hooks/useTrackingTypes.ts`
- ✅ `src/features/tracking/hooks/useInfiniteTrackingRecords.ts`
- ✅ `src/features/tracking/hooks/useTrackingRecords.ts`
- ✅ `src/features/questionnaire/hooks/useQuestionnaire.ts`

### Pattern Applied

```typescript
// Added to all hooks:
const { isAuthenticated } = useAuth();

// Modified enabled condition:
enabled: isAuthenticated && otherConditions;
```

## Usage Examples

### Tracking Components

```typescript
const MyTrackingComponent = () => {
  const { data: trackingTypes, isLoading } = useTrackingTypes();

  // Will show loading until authenticated, then fetch data
  if (isLoading) return <LoadingSpinner />;

  return <TrackingTypesList types={trackingTypes} />;
};
```

### Questionnaire Components

```typescript
const QuestionnaireScreen = () => {
  const { question, isLoading } = useQuestionnaire();

  // Will wait for authentication before fetching questions
  if (isLoading) return <LoadingScreen />;

  return <QuestionView question={question} />;
};
```

## Testing Considerations

### What to Test

1. **Unauthenticated state**: Verify API calls don't execute
2. **Authentication transition**: Ensure hooks activate after login
3. **Data loading**: Confirm data fetches correctly post-auth
4. **Error handling**: Test behavior with expired tokens

### Expected Behavior

- ✅ No API calls before authentication
- ✅ Hooks activate automatically after login
- ✅ Existing functionality unchanged (just gated by auth)
- ✅ Clean loading states throughout authentication flow

## Migration Notes

### No Breaking Changes

- Existing components continue to work
- Same API for all hooks
- Only internal behavior changed (when queries execute)

### Enhanced Reliability

- Eliminates race conditions between auth and API calls
- More predictable app startup sequence
- Better error boundaries around authentication
