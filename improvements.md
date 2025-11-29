# Critical Codebase Improvements

Based on a review of `rules.md` and the codebase, here are the 6 most crucial issues that need to be addressed to align with the project's standards and ensure a high-quality application.

## 1. Performance: List Rendering in `JournalScreen`

**Violation:** Rule 6.1 (Lists & Rendering)
**Location:** `src/features/home/screens/JournalScreen.tsx` and `src/features/tracking/components/TrackingRecordsList.tsx`
**Issue:** The `JournalScreen` wraps `TrackingRecordsList` inside a `ScrollView`. `TrackingRecordsList` then renders items using `.map()`.
**Why it's crucial:** This renders **all** tracking records at once, regardless of whether they are on screen. As the user's history grows, this will cause significant performance degradation, memory usage spikes, and slow initial rendering.
**Fix:** Refactor `JournalScreen` to use a `FlatList`. The header content should be passed as `ListHeaderComponent` to the `FlatList` instead of wrapping everything in a `ScrollView`.

## 2. Type Safety: Widespread use of `any`

**Violation:** Rule 2 (TypeScript & Code Quality)
**Location:** `src/shared/error/ErrorFactory.ts`, `src/shared/api/authenticatedFetch.ts`, `src/shared/error/ErrorContext.tsx`
**Issue:** There are approximately 20+ instances of `any` usage, particularly in core error handling and API modules (e.g., `error: any`, `data?: any`).
**Why it's crucial:** This defeats the purpose of TypeScript, leading to potential runtime crashes that the compiler cannot catch. It makes the "Global Error Boundary" (Rule 7) less effective because errors aren't predictable.
**Fix:** Replace `any` with `unknown` and use type guards, or define proper interfaces (e.g., `ApiErrorResponse`) for these data structures.

## 3. State Management: Manual Loading/Error States

**Violation:** Rule 4 (State Management & API)
**Location:** `src/features/questionnaire/hooks/useQuestionnaire.ts`, `useSmokingTriggersQuestion.ts`
**Issue:** Several hooks are manually managing `isLoading` and `error` states using `useState` and `useEffect`, rather than relying on React Query's built-in state management.
**Why it's crucial:** This leads to boilerplate code, potential race conditions, and inconsistent state updates. It ignores the architectural decision to use React Query for server state.
**Fix:** Refactor these hooks to return the `isLoading`, `isError`, and `error` properties directly from the `useQuery` or `useMutation` hooks.

## 4. Maintainability: Hardcoded Colors & Inline Styles

**Violation:** Rule 3 (Component Design System)
**Location:** `src/features/home/screens/JournalScreen.tsx` (e.g., `#2A2A2A`), `src/shared/components/toast/Toast.tsx` (e.g., `#059669`), `src/shared/styles/commonStyles.ts`
**Issue:** There are numerous hardcoded hex codes and inline style objects scattered throughout the app.
**Why it's crucial:** This breaks the "Centralized Theme" rule. Changing the app's theme or supporting dark mode becomes impossible without a massive refactor. It also leads to visual inconsistencies.
**Fix:** Replace all hardcoded colors with tokens from `COLOR_PALETTE` in `@/shared/theme`. Move inline styles to `StyleSheet.create`.

## 5. Security & Cleanliness: Production `console.log` Usage

**Violation:** Rule 2 (Code Quality)
**Location:** `App.tsx`, `src/shared/hooks/useUserStatusUpdate.ts`, `src/shared/components/StartupNavigationHandler.tsx`
**Issue:** `console.log` is used extensively, including logging configuration objects (`Config`) and user data.
**Why it's crucial:**

1.  **Security:** Logging `Config` or user objects can leak sensitive information (like API tokens or PII) to the system logs.
2.  **Performance:** Console logs can slow down the JS thread in React Native, especially during high-frequency events.
    **Fix:** Remove all `console.log` statements. Use a proper logging service or the `ErrorLogger` for actual errors, and ensure no sensitive data is logged.

## 6. UX: Missing Skeleton Loading States

**Violation:** Rule 6.6 (Skeleton Loading States)
**Location:** `src/features/tracking/components/TrackingRecordsList.tsx`
**Issue:** The list uses a simple text message ("Bringing your notes together...") for the loading state.
**Why it's crucial:** The rules explicitly state to "Prefer skeleton loaders over spinners for large or content-heavy screens." Text loading states make the app feel slower and less polished ("perceived performance").
**Fix:** Create a `TrackingRecordSkeleton` component and display a list of these skeletons while the data is fetching.
