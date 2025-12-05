# Best Practices Violations Documentation

This document identifies violations of coding best practices within the Quit-It-App codebase. The focus areas are:

- **Magic Numbers**: Hardcoded numeric values that should be constants
- **Smart UI Components**: Components that contain business logic, API calls, or complex state management
- **Single Responsibility Principle (SRP) Violations**: Functions/components doing multiple unrelated things
- **TypeScript `any` Type Usage**: Places where proper typing should be used instead

---

## A) Magic Numbers

Magic numbers are hardcoded numeric values that lack context and should be extracted into named constants.

### High Priority

#### `src/shared/components/ui/DraggableModal.tsx`

- **Line 52**: `if (gestureState.dy > 100)`

  - Magic number for swipe threshold
  - Should be: `const SWIPE_DISMISS_THRESHOLD = 100`

- **Line 57, 76, 90, 95**: Animation durations `200`, `300`

  - Should be named constants: `ANIMATION_DURATION_SHORT`, `ANIMATION_DURATION_MEDIUM`

- **Line 149-151**: Border radius and height percentages

  - `borderTopLeftRadius: 20`, `borderTopRightRadius: 20`, `height: '85%'`
  - Should be named constants in theme

- **Line 168**: `width: 44`
  - Magic number for drag indicator width
  - Should be: `DRAG_INDICATOR_WIDTH`

#### `src/shared/components/toast/ToastContext.tsx`

- **Line 36**: `duration = 3000`

  - Default toast duration
  - Should be: `const DEFAULT_TOAST_DURATION = 3000`

- **Line 38**: `.substr(2, 9)`
  - Magic numbers for ID generation
  - Should be named constants

#### `src/shared/components/toast/Toast.tsx`

- **Line 16**: `new Animated.Value(-100)`

  - Initial slide position
  - Should be: `const TOAST_INITIAL_OFFSET = -100`

- **Line 23, 28**: `duration: 300`
  - Animation duration
  - Should use theme constant

#### `src/utils/scrollManager.ts`

- **Line 17**: `delay: number = 150`
  - Default scroll delay
  - Should be: `const DEFAULT_SCROLL_DELAY = 150`

#### `src/features/tracking/components/CravingChart.tsx`

- **Line 73**: `fontSize: 12`

  - Should use typography constants

- **Line 158, 175**: `DEVICE_HEIGHT * 0.35`

  - Magic ratio for chart height
  - Should be: `const CHART_HEIGHT_RATIO = 0.35`

- **Line 195-197**: Tooltip positioning

  - `top: tooltip.y - 40`, `left: tooltip.x - 20`, `zIndex: 10`
  - Should be named constants

- **Line 230**: `width: 70`
  - Legend width
  - Should be constant

#### `src/features/tracking/components/TrackingRecordsList.tsx`

- **Line 116**: `height: 16`

  - Item separator height
  - Should use spacing constant or be named

- **Line 161**: `width: '60%'`
  - Button width percentage
  - Should be: `const CTA_BUTTON_WIDTH_RATIO = '60%'`

#### `src/shared/components/ui/SkeletonBox.tsx`

- **Line 48, 54**: `duration: 800`

  - Pulse animation duration
  - Should be: `const SKELETON_PULSE_DURATION = 800`

- **Line 48**: `OPACITY.skeleton + 0.15`
  - Magic opacity adjustment
  - Should be named constant

#### `src/shared/components/ui/ModalActionHeader.tsx`

- **Line 40, 51**: `hitSlop={10}`
  - Touch target expansion
  - Should be: `const ICON_HIT_SLOP = 10`

#### `src/shared/components/ui/AppTextInput.tsx`

- **Line 32**: `DEVICE_HEIGHT * 0.15`
  - Multiline input height ratio
  - Should be: `const MULTILINE_INPUT_HEIGHT_RATIO = 0.15`

#### `src/shared/components/StartupNavigationHandler.tsx`

- **Line 170**: `setTimeout(..., 100)`
  - Navigation retry delay
  - Should be: `const NAVIGATION_RETRY_DELAY = 100`

### Medium Priority

#### `src/features/home/components/WelcomeComponent.tsx`

- **Line 28**: `setInterval(updateTime, 1000)`
  - Update interval
  - Should be: `const TIME_UPDATE_INTERVAL = 1000`

#### `src/shared/components/ui/ScreenHeader.tsx`

- **Line 43**: `height * 0.05`
  - Top margin ratio
  - Should be: `const HEADER_TOP_MARGIN_RATIO = 0.05`

#### `src/shared/hooks/useCustomPasswordValidation.ts`

- **Line 26, 37**: `32` (max password length)
  - Duplicated magic number
  - Should be: `const MAX_PASSWORD_LENGTH = 32`

#### `src/shared/i18n/en.ts`

- **Line 16**: `'8-32 characters'`
  - Password length requirement hardcoded in translation
  - Should reference constants

### Low Priority (Theme/Style Constants)

The following files contain magic numbers that are primarily styling values. While they could benefit from being in the theme system, they are lower priority:

- `src/shared/error/GlobalErrorBoundary.tsx`: Lines 50-74 (inline styles)
- `src/features/tracking/components/CravingChart.tsx`: Various style numbers
- `src/shared/components/ui/Logo.tsx`: Lines 13, 16, 19 (size configurations)

---

## B) Smart UI Components

Smart components contain business logic, API calls, state management, or navigation logic. They should ideally be split into presentational and container components.

### Critical Violations

#### `src/shared/auth/AuthContext.tsx`

**Issues:**

- Massive component (450+ lines) acting as both context provider and business logic container
- Handles authentication, user management, navigation, and state
- Contains 8+ different responsibilities:
  - Stytch integration
  - Local state management
  - Backend API calls (loginUser, createUser)
  - Token storage
  - Navigation (resetNavigation)
  - Query cache management (clearQueryCache)
  - User status updates
  - Session management

**Recommendation:** Split into:

- `AuthContext.tsx` (pure context)
- `useAuthProvider.ts` (hook with logic)
- `authService.ts` (backend integration)
- `authNavigation.ts` (navigation logic)

#### `src/shared/components/StartupNavigationHandler.tsx`

**Issues:**

- 189 lines of complex startup logic
- Mixes UI rendering with:
  - Authentication bootstrap
  - Session validation
  - User status checking
  - Navigation logic
  - Error handling
- Multiple state variables managing navigation flow
- Complex useEffect chains

**Recommendation:** Extract to:

- `useStartupNavigation.ts` hook
- `startupNavigationService.ts` for business logic
- Keep component as thin wrapper

#### `src/features/auth/screens/AuthScreen.tsx`

**Issues:**

- Large screen component (140+ lines)
- Contains form logic, validation, keyboard handling
- While it delegates to `useAuthForm`, the component is still quite large

**Recommendation:**

- Already using a hook pattern (good!)
- Could further split into smaller sub-components
- Consider extracting keyboard navigation logic

### Moderate Violations

#### `src/navigation/CreateNoteModal.tsx`

**Issues:**

- Modal contains business logic via `useNotesCardController`
- Manages scroll behavior
- Handles save success callbacks
- Translation integration

**Status:** Partially mitigated by using controller hook, but modal still coordinates multiple concerns

#### `src/features/home/screens/HomeDashboardScreen.tsx`

**Issues:**

- Fetches data via multiple hooks (`useHomeDashboardStats`, `useWelcomeData`)
- Transforms data for child components

**Status:** Relatively clean, uses custom hooks well, but could extract data fetching to container

#### `src/features/tracking/components/TrackingRecordsList.tsx`

**Issues:**

- Has both presentational (`TrackingRecordsList`) and smart (`TrackingRecordsListContainer`) components in same file
- Container component:
  - Fetches data (3 different queries)
  - Transforms data
  - Manages pagination
  - Calculates totals

**Positive:** Already split into dumb/smart components! Good pattern.
**Recommendation:** Move to separate files for clarity

### Minor Violations

#### `src/features/journal/screens/JournalScreen.tsx`

**Issues:**

- Uses `useQueryClient` directly
- Could abstract query client usage into a hook

#### Components using React Query hooks directly

Many screen components use `useMutation`, `useQuery`, `useQueryClient` directly. While this is acceptable, it couples the component to the data layer:

- `src/features/tracking/hooks/useTrackingMutations.ts`
- `src/features/questionnaire/hooks/*`

**Recommendation:** Consider facade hooks to abstract data fetching concerns

---

## C) Single Responsibility Principle (SRP) Violations

Functions and components that have multiple unrelated responsibilities.

### Critical Violations

#### `src/shared/auth/AuthContext.tsx` - `AuthProvider` Component

**Multiple Responsibilities:**

1. State management (tokens, user, loading, authentication)
2. Stytch SDK integration
3. Backend API integration (login/signup)
4. Token storage/retrieval
5. Navigation control
6. Query cache management
7. User data synchronization
8. Session management

**Impact:** 450+ line component, difficult to test, maintain, and understand

#### `src/shared/auth/AuthContext.tsx` - `login()` Function

**Multiple Responsibilities:**

1. Stytch password authentication
2. Token creation and storage
3. User data creation and storage
4. Backend login API call
5. User status handling
6. State updates (multiple)
7. Error handling

**Lines:** 82-161 (80 lines!)

#### `src/shared/auth/AuthContext.tsx` - `signup()` Function

**Multiple Responsibilities:**

1. Stytch account creation
2. Token management
3. User data management
4. Backend user creation
5. Name formatting/processing
6. State updates
7. Error handling

**Lines:** 166-283 (118 lines!)

#### `src/shared/services/userStatusService.ts` - Multiple Responsibilities

**The service handles:**

1. Status map caching
2. Network fetching
3. Local storage persistence
4. Status-to-action mapping
5. Navigation execution
6. Cache invalidation

**Recommendation:** Split into:

- `UserStatusCache` (caching logic)
- `UserStatusFetcher` (API calls)
- `UserStatusMapper` (status to action mapping)
- `UserStatusNavigator` (navigation logic)

#### `src/shared/components/StartupNavigationHandler.tsx` - `handleStartupNavigation()`

**Multiple Responsibilities:**

1. Auth state bootstrapping
2. Token validation
3. User status checking
4. Navigation decision logic
5. Error handling
6. Multiple conditional paths

**Lines:** 69-137 (68 lines of complex conditionals)

#### `src/shared/api/apiClient.ts` - `ApiClient` Class

**Multiple Responsibilities:**

1. Request interceptor management
2. Response interceptor management
3. Error interceptor management
4. Authentication token injection
5. Token refresh handling
6. Error response handling
7. Toast notification integration
8. Session management (401 handling)

**Recommendation:** Split into separate interceptor classes

### Moderate Violations

#### `src/shared/components/ui/AppDateTimePicker.tsx` - `useAppDateTimePicker()` Hook

**Multiple Responsibilities:**

1. Platform-specific picker logic (iOS vs Android)
2. DateTime mode handling (date/time/datetime)
3. Android multi-step picker flow
4. Display formatting
5. Event handling

**Lines:** 100+ lines for a single hook

#### `src/features/home/hooks/useHomeDashboardStats.ts`

**Multiple Responsibilities:**

1. Fetches craving analytics
2. Fetches smoking analytics
3. Transforms data for chart
4. Calculates stats
5. Manages loading/error states for both
6. Provides refetch functions

**Recommendation:** Could split data fetching from transformation

#### `src/shared/hooks/useUserStatusUpdate.ts`

**Multiple Responsibilities:**

1. Updates user data in AuthContext
2. Refreshes UserStatusService cache
3. Executes navigation

**Note:** Small enough that it's acceptable, but does cross concerns

### Minor Violations

#### `src/utils/dateUtils.ts`

Contains multiple unrelated date utility functions. While acceptable for a utility file, functions serve different purposes:

- Date formatting
- Relative date calculation
- Time difference formatting
- Multiple format variations

**Recommendation:** Consider splitting into:

- `dateFormatters.ts`
- `dateCalculations.ts`
- `relativeDateUtils.ts`

---

## D) TypeScript `any` Type Usage

Using `any` defeats the purpose of TypeScript's type safety. Each instance should be properly typed.

### Critical Issues

#### `src/shared/auth/types.ts`

```typescript
export interface UserData {
  // ... other fields
  [key: string]: any; // Line 15
}
```

**Issue:** Index signature allows any property with any type
**Recommendation:** Remove index signature or make it specific (e.g., `[key: string]: string | number | null | undefined`)

#### `src/shared/auth/authBootstrap.ts`

```typescript
export async function bootstrapAuthState(
  stytchClient: any, // Line 17
): Promise<BootstrapAuthResult>;
```

**Issue:** Stytch client not typed
**Recommendation:**

```typescript
import type { StytchClient } from '@stytch/react-native';
// or
import { useStytch } from '@stytch/react-native';
type StytchClientType = ReturnType<typeof useStytch>;
```

#### `src/shared/components/ui/AppDateTimePicker.tsx`

```typescript
const pickerMode: any = // Line 38
  Platform.OS === 'android' && mode === 'datetime'
    ? androidMode
    : mode === 'datetime'
    ? 'datetime'
    : mode;
```

**Issue:** Picker mode should be properly typed
**Recommendation:**

```typescript
const pickerMode: 'date' | 'time' | 'datetime' = // ...
```

### Moderate Issues

#### `src/shared/api/apiClient.ts`

```typescript
// Multiple occurrences:
data?: any,  // Lines 242, 257, 304, 320
```

**Issue:** Request body data not typed
**Recommendation:** Use generics:

```typescript
export async function apiPost<TData = unknown>(
  url: string,
  data?: TData,
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
): Promise<Response>;
```

#### `src/shared/services/userStatusService.ts`

```typescript
navigation: NativeStackNavigationProp<RootStackParamList, any>,  // Line 133
```

**Issue:** Route name should be typed
**Recommendation:**

```typescript
navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
```

#### `src/shared/hooks/useUserStatusUpdate.ts`

```typescript
navigation: NativeStackNavigationProp<RootStackParamList, any>,  // Line 39
```

**Same issue as above**

### Minor Issues (React Component Props)

#### `src/features/tracking/components/TrackingRecordsList.tsx`

```typescript
ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;  // Lines 56, 224
```

**Issue:** React's built-in type allows `any` for component props
**Recommendation:** This is acceptable as it matches React's own typing. Could be:

```typescript
ListHeaderComponent?: React.ComponentType<{}> | React.ReactElement | null;
```

#### `src/features/questionnaire/components/QuestionnaireSkeleton.tsx`

```typescript
style?: any;  // Line 13
```

**Issue:** Style prop not typed
**Recommendation:**

```typescript
import { StyleProp, ViewStyle } from 'react-native';
style?: StyleProp<ViewStyle>;
```

### False Positives (Not Issues)

The following instances are in comments and not actual code issues:

- `src/utils/scrollManager.ts` - Lines 13, 18, 35 (comments)
- `src/shared/components/ui/DraggableModal.tsx` - Lines 55, 102, 104 (variable names containing "any")
- `src/shared/components/toast/ToastContext.tsx` - Line 46 (comment)
- `src/shared/components/StartupNavigationHandler.tsx` - Line 130 (comment)
- `src/shared/components/dev/DeveloperMenu.tsx` - Line 98 (comment)
- `src/shared/api/apiClient.ts` - Line 189 (comment)

---

## Summary Statistics

### Magic Numbers

- **Critical**: 20+ instances requiring immediate attention
- **Medium**: 10+ instances
- **Low**: 30+ styling values in theme files

### Smart Components

- **Critical**: 3 components (AuthContext, StartupNavigationHandler, AuthScreen)
- **Moderate**: 4 components
- **Minor**: 10+ components using data hooks directly

### SRP Violations

- **Critical**: 6 major violations (AuthProvider, login, signup, UserStatusService, handleStartupNavigation, ApiClient)
- **Moderate**: 4 violations
- **Minor**: Several utility file organizations

### TypeScript `any` Usage

- **Critical**: 4 instances requiring proper typing
- **Moderate**: 6 instances in API/navigation code
- **Minor**: 3 instances in component props
- **Acceptable**: 2 instances (React component types)

---

## Recommended Prioritization

### Phase 1 (High Impact, Quick Wins)

1. Fix critical `any` types (AuthBootstrap, UserData, AppDateTimePicker)
2. Extract magic numbers in DraggableModal and toast components
3. Document constants for animation durations, delays, and ratios

### Phase 2 (Refactoring)

1. Split AuthContext into multiple modules
2. Extract StartupNavigationHandler logic into hooks/services
3. Refactor UserStatusService to separate concerns
4. Split ApiClient interceptors into separate classes

### Phase 3 (Code Quality)

1. Address remaining magic numbers in chart components
2. Extract presentation components from smart components
3. Create typed generics for API functions
4. Organize utility files by concern

---

## Notes

- Many patterns in the codebase are actually quite good (container/presenter split in TrackingRecordsList)
- The app uses custom hooks extensively, which is a positive pattern
- Theme system is well-organized, but not fully utilized everywhere
- Some "violations" are acceptable trade-offs for simplicity in smaller components

**Document Generated:** December 5, 2025
**Codebase Version:** main branch
