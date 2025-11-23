# User Types Implementation

## Overview

Added User Types API support following the same pattern as UserStatus calls in the auth/login/startup flow.

## What was added:

### 1. Types (`src/shared/types/userType.ts`)

- `UserType` interface with `id` and `code` fields
- `UserTypesResponse` interface for API responses
- `UserTypeMap` for internal mapping

### 2. API Layer (`src/shared/api/userTypeApi.ts`)

- `fetchUserTypes()` function that calls `GET /api/v1/auth/types`
- Follows same error handling pattern as `fetchUserStatuses()`
- Returns list of `{id, code}` pairs

### 3. Service Layer (`src/shared/services/userTypeService.ts`)

- `UserTypeService` class with static methods
- `initialize()` - fetches and caches user types on startup
- `getType(id)` - get type by ID
- `getTypeByCode(code)` - get type by code string
- `getAllTypes()` - get all available types
- `isInitialized()` - check if service is ready
- `reset()` - for testing/re-initialization

### 4. Integration (`src/shared/auth/AuthContext.tsx`)

- Added UserTypeService initialization alongside UserStatusService
- Both services initialize in parallel during app startup
- Available immediately after authentication

### 5. Exports (`src/shared/services/index.ts`)

- Clean imports: `import { UserTypeService } from '@/shared/services'`

## Usage Examples:

```typescript
import { UserTypeService } from '@/shared/services';

// Get user type by ID (from user data response)
const userType = UserTypeService.getType(userTypeId);
console.log('User type:', userType?.code);

// Get user type by code
const premiumType = UserTypeService.getTypeByCode('premium');

// Get all available types
const allTypes = UserTypeService.getAllTypes();
console.log('Available user types:', allTypes);

// Check if service is ready
if (UserTypeService.isInitialized()) {
  // Safe to use service methods
}
```

## API Endpoint

- **URL**: `GET /api/v1/auth/types`
- **Response**:

```json
{
  "data": {
    "types": [
      { "id": 1, "code": "free" },
      { "id": 2, "code": "premium" },
      { "id": 3, "code": "enterprise" }
    ]
  }
}
```

The UserTypeService is now initialized automatically during app startup and is available throughout the application for handling user type logic.
