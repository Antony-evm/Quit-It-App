# User Status Management Refactoring

## Problem: Magic Strings Anti-pattern

The original implementation used magic strings for user status codes and actions, which is error-prone and hard to maintain:

```typescript
// ❌ BAD: Magic strings everywhere
switch (status.code) {
  case 'onboarding_incomplete': // Easy to typo
    action = { type: 'NAVIGATE_TO_QUESTIONNAIRE' }; // Hard to refactor
    break;
  // ...
}
```

## Solution Options

### Option 1: Constants-Based (✅ IMPLEMENTED)

**Benefits:**

- ✅ Eliminates magic strings
- ✅ Type-safe with TypeScript
- ✅ Easy to refactor (find/replace works)
- ✅ Centralized in constants file
- ✅ Maintains existing backend contract

**Implementation:**

- `src/shared/constants/userStatus.ts` - Centralized constants
- `src/shared/utils/statusActionConfig.ts` - Configuration object instead of switch
- Updated types to use constants

**Usage:**

```typescript
// ✅ GOOD: Type-safe constants
case USER_STATUS_CODES.ONBOARDING_INCOMPLETE:
  action = { type: USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE };
```

### Option 2: Backend-Driven Configuration (🚀 FUTURE)

**Benefits:**

- 🚀 Ultimate flexibility - no frontend code changes for new statuses
- 🚀 Backend controls navigation logic
- 🚀 A/B testing friendly
- 🚀 Multi-tenant support
- ⚠️ Requires backend changes

**Implementation:**

- `src/shared/services/enhancedUserStatusService.ts` - Example implementation
- Backend returns navigation instructions with each status

**Backend Response:**

```json
{
  "data": {
    "statuses": [
      {
        "id": 1,
        "code": "onboarding_incomplete",
        "navigation_action": {
          "type": "NAVIGATE",
          "target": "Questionnaire"
        }
      }
    ]
  }
}
```

### Option 3: Hybrid Configuration (⚡ CURRENT)

**Benefits:**

- ⚡ Clean, maintainable code
- ⚡ Easy to modify mappings
- ⚡ No switch statements
- ⚡ Runtime configurable
- ⚡ Works with existing backend

**Implementation:**

```typescript
const STATUS_ACTION_CONFIG = {
  [USER_STATUS_CODES.ONBOARDING_INCOMPLETE]: {
    type: USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE,
  },
  // ...
};

// Simple lookup instead of switch
const action = getStatusAction(status);
```

## Recommendations

### Immediate (Current Implementation)

- ✅ **Option 1 + 3**: Use constants with configuration object
- ✅ Eliminates all magic strings
- ✅ Much cleaner and maintainable
- ✅ No breaking changes

### Future Enhancement

- 🚀 **Option 2**: Move to backend-driven configuration
- 🚀 Allows dynamic status/navigation changes without app updates
- 🚀 Perfect for growth and experimentation

## Migration Path

1. **Phase 1** (✅ Complete): Replace magic strings with constants
2. **Phase 2** (Future): Add backend API to return navigation actions
3. **Phase 3** (Future): Migrate to backend-driven system

## Benefits Achieved

- 🛡️ **Type Safety**: All strings are now typed constants
- 🔧 **Maintainability**: Easy to modify status mappings
- 🚀 **Extensibility**: Adding new statuses is trivial
- 🧹 **Clean Code**: No more magic strings or large switch statements
- 🔍 **Searchability**: Can easily find all usages of status codes
- 🔄 **Refactoring**: Rename operations work across codebase

## File Structure

```
src/shared/
├── constants/
│   └── userStatus.ts          # All status constants
├── types/
│   └── userStatus.ts          # Type definitions using constants
├── utils/
│   └── statusActionConfig.ts  # Configuration-based mapping
└── services/
    ├── userStatusService.ts           # Current implementation
    └── enhancedUserStatusService.ts   # Future backend-driven approach
```
