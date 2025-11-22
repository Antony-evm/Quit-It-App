# Centralized Error Handling Implementation Guide

## Overview

This centralized error handling solution replaces scattered try-catch blocks and inconsistent Alert.alert usage throughout the app with a unified error management system.

## Key Components

### 1. Error Types and Factory

- `AppError`: Custom error class with categorization and severity
- `ErrorFactory`: Factory methods for creating standardized errors
- Error categories: Network, Authentication, Validation, Storage, etc.

### 2. Error Handler Service

- Centralized error logging and user notification
- Consistent error formatting and display
- Integration with toast notifications and alerts

### 3. React Context and Hook

- `ErrorHandlerProvider`: Context provider for error handling
- `useErrorHandler`: Hook for components to handle errors consistently

## Implementation Examples

### Before (Scattered Error Handling)

```typescript
// In useAuthForm.ts - BEFORE
const handleLogin = async () => {
  try {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isEmailValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    await login(email, password);
  } catch (error) {
    Alert.alert('Error', 'Invalid email or password. Please try again.');
  }
};

// In deleteTrackingRecord.ts - BEFORE
export const deleteTrackingRecord = async (recordId: number) => {
  const response = await authenticatedDelete(url);

  if (!response.ok) {
    throw new Error(`Failed to delete tracking record: ${response.status}`);
  }
};

// In authService.ts - BEFORE
static async storeTokens(tokens: AuthTokens): Promise<void> {
  try {
    await Promise.all([...]);
  } catch (error) {
    console.error('Failed to store auth tokens:', error);
    throw new Error('Failed to store authentication tokens');
  }
}
```

### After (Centralized Error Handling)

```typescript
// In useAuthForm.ts - AFTER
const { handleValidationError, withErrorHandling } = useErrorHandler();

const handleLogin = withErrorHandling(
  async () => {
    // Validation with centralized error handling
    if (!email.trim()) {
      await handleValidationError('email', 'Please enter your email address');
      return;
    }

    if (!isEmailValid) {
      await handleValidationError('email', 'Please enter a valid email address');
      return;
    }

    await login(email, password);
  },
  {
    showToast: true,
    context: { operation: 'login', email },
  }
);

// In deleteTrackingRecord.ts - AFTER
export const deleteTrackingRecord = async (recordId: number) => {
  try {
    const response = await authenticatedDelete(url);

    if (!response.ok) {
      throw ErrorFactory.apiError(
        response.status,
        'Failed to delete tracking record',
        { recordId, url, operation: 'delete_tracking_record' }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AppError') {
      throw error;
    }

    throw ErrorFactory.networkError(
      `Failed to delete tracking record: ${error}`,
      { recordId, url, operation: 'delete_tracking_record' }
    );
  }
};

// In authService.ts - AFTER
static async storeTokens(tokens: AuthTokens): Promise<void> {
  try {
    await Promise.all([...]);
  } catch (error) {
    throw ErrorFactory.storageError('store auth tokens', error, {
      operation: 'store_auth_tokens'
    });
  }
}
```

## Integration in App.tsx

```typescript
import { ErrorHandlerProvider } from '@/shared/error';
import { ToastProvider } from '@/shared/components/toast';

function App() {
  return (
    <ToastProvider>
      <ErrorHandlerProvider preferToast={true}>
        {/* Your app components */}
      </ErrorHandlerProvider>
    </ToastProvider>
  );
}
```

## Component Usage Pattern

```typescript
import { useErrorHandler } from '@/shared/error';

function MyComponent() {
  const { handleError, handleApiError, withErrorHandling } = useErrorHandler();

  // Method 1: Wrap async functions
  const saveData = withErrorHandling(
    async data => {
      await api.saveData(data);
    },
    { showToast: true },
  );

  // Method 2: Manual error handling
  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      await handleError(error, {
        context: { operation: 'handle_action' },
      });
    }
  };

  return <Button onPress={saveData} title="Save" />;
}
```

## Benefits

### 1. Consistency

- All errors use the same user-friendly messaging format
- Consistent logging and error categorization
- Unified notification system (toast vs alert)

### 2. Maintainability

- Single place to modify error handling logic
- Easy to add new error types or modify existing ones
- Centralized logging configuration

### 3. User Experience

- Better error messages tailored to user context
- Consistent visual presentation of errors
- Proper error categorization (retryable vs non-retryable)

### 4. Developer Experience

- Less boilerplate code in components
- Type-safe error handling
- Comprehensive error logging for debugging

## Migration Strategy

### Phase 1: Infrastructure (Completed)

- ✅ Created error types and factory
- ✅ Implemented error handler service
- ✅ Added React context and hook
- ✅ Updated API layer

### Phase 2: Core Services (Completed)

- ✅ Refactored auth service
- ✅ Updated authentication context

### Phase 3: Components (In Progress)

- 🔄 Update form validation components
- 🔄 Refactor data fetching hooks
- 🔄 Update developer menu component

### Phase 4: Integration

- 🔄 Add ErrorHandlerProvider to App.tsx
- 🔄 Update mutation error handling
- 🔄 Add error boundary components

## Error Categories Handled

1. **Network Errors** (8 API functions updated)

   - Failed requests, timeouts, connectivity issues
   - User-friendly messages with retry options

2. **Authentication Errors** (AuthService + AuthContext)

   - Session expiration, login failures
   - Automatic redirect to login when needed

3. **Validation Errors** (Form components)

   - Field validation with specific error messages
   - Form-level validation feedback

4. **Storage Errors** (AuthService + data persistence)

   - AsyncStorage failures, data corruption
   - Graceful degradation when storage fails

5. **Business Logic Errors**
   - Application-specific error scenarios
   - Context-aware error messages

## Files Updated

### Core Error System (6 files)

- `src/shared/error/types.ts`
- `src/shared/error/ErrorFactory.ts`
- `src/shared/error/ErrorLogger.ts`
- `src/shared/error/ErrorHandlerService.ts`
- `src/shared/error/ErrorContext.tsx`
- `src/shared/error/index.ts`

### API Layer (6 files)

- `src/features/tracking/api/createTrackingRecord.ts`
- `src/features/tracking/api/deleteTrackingRecord.ts`
- `src/features/tracking/api/fetchTrackingRecords.ts`
- `src/features/tracking/api/updateTrackingRecord.ts`
- `src/features/auth/api/loginUser.ts`
- `src/features/auth/api/createUser.ts`

### Authentication Services (1 file)

- `src/shared/auth/authService.ts`

Total: **13 new/updated files** solving error handling across **8 major problem areas** identified in the codebase.
