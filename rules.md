# Development Rules & Principles

These rules define the architectural and coding standards for the Quit-It-App. They are designed to ensure scalability, maintainability, and a high-quality user experience in React Native.

## 1. Architecture & Organization

**Principle:** Code should be organized by **feature**, not file type, and logic must be separated from UI.

- **Feature-Based Structure:** Organize code into `src/features/auth`, `src/features/profile`, etc.
- **Public API:** Each feature must expose its public interface via an `index.ts` file. Keep internals private.
- **Separation of Concerns:**
  - **Logic:** Business logic, state management, and side effects belong in **Custom Hooks** (e.g., `useLogin`).
  - **UI:** Components must be pure, presentational, and receive data via props.
  - **Screens:** Act as orchestrators connecting Hooks to UI components. Avoid implementing logic directly in screens.

## 2. TypeScript & Code Quality

**Principle:** Rely on the type system to catch errors early and enforce code cleanliness.

- **Strict Mode:** `tsconfig.json` must have `"strict": true`.
- **No `any`:** The `any` type is forbidden. Use `unknown` and narrow it, or define strict interfaces.
- **Explicit Returns:** All functions, hooks, and components must have explicit return types.
- **Clean Code:** No unused imports, variables, or `console.log` in production. CI must enforce linting (ESLint) and formatting (Prettier).

## 3. Component Design System (Atomic & Shadcn-Inspired)

**Principle:** Build complex UIs by composing small, unopinionated, and reusable primitives.

- **Atomic Composition:** Build from the bottom up:
  - **Primitives:** Simple, styled RN elements (`Box`, `Text`, `Button`) wrapping `View`/`Text`.
  - **Components:** Reusable UI patterns (`Card`, `Input`) composed of primitives.
  - **Screens:** Compositions of components.
- **Centralized Theme:** All styles must use the centralized `theme` object. No magic numbers or hardcoded hex codes.
- **Composition over Configuration:** Prefer passing `children` to components rather than creating massive configuration props objects.
- **No God Components:** A component should do one thing. If it handles logic, layout, and data fetching, break it apart.

## 4. State Management & API

**Principle:** Server state and UI state are distinct and should be managed differently.

- **Server State:** Use **React Query** for all async data. Do not manually manage `isLoading`/`error` flags in components.
- **Centralized API:** All API calls live in `src/api/` or feature-specific `api/` folders.
- **Data Transformation:** API modules must return domain models, not raw backend JSON. Use DTOs/adapters where necessary.

## 5. Navigation

**Principle:** Navigation must be fully type-safe to prevent runtime crashes.

- **Type Safety:** All routes must be defined in `RootStackParamList`.
- **No `any` in Navigation:** Never use `navigation: any`. Use typed hooks (`useAppNavigation`, `useAppRoute`).
- **Compile-Time Validation:** Route parameters must be validated by TypeScript.

## 6. React Native Best Practices

**Principle:** Optimize for the mobile platform's unique performance and interaction constraints.

### 6.1 Lists & Rendering

- **Rule:** Use `FlatList` or `SectionList` for rendering any meaningful list of items.
- **Rule:** Never map arrays directly inside a `ScrollView` for long or dynamic lists.

### 6.2 Avoid Unnecessary Re-renders

- **Rule:** Memoize heavy or frequently-rerendered components using `React.memo`.
- **Rule:** Use `useCallback` and `useMemo` for stable function references where appropriate.
- **Rule:** Screens and components must avoid inline object or array creation in render when possible.

### 6.3 Touch Feedback & Interactions

- **Rule:** Prefer proper interaction components:
  - `Pressable` for generic interactions
  - `TouchableOpacity` for opacity feedback
  - `TouchableWithoutFeedback` only when intentional
- **Rule:** Do not reimplement touch feedback manually unless absolutely necessary.

### 6.4 Platform Correctness

- **Rule:** Use platform splitting (`Component.ios.tsx` / `Component.android.tsx`) when the logic diverges meaningfully.
- **Rule:** Avoid large conditional blocks like `if (Platform.OS === 'ios')` in components unless trivial.

### 6.5 Accessibility First

- **Rule:** All interactive components must have proper accessibility labels.
- **Rule:** Use `accessibilityRole` and `accessible` for meaningful components.
- **Rule:** Accessibility must not be treated as optional.

### 6.6 Skeleton Loading States

- **Rule:** Prefer skeleton loaders over spinners for large or content-heavy screens.
- **Rule:** Skeletons must be reusable and part of the UI primitives.
- **Rule:** Use skeletons for lists, cards, profile screens, and dashboards while data loads.
- **Rule:** Only use spinners for short-duration or button-level operations.

## 7. Error Handling & Resilience

**Principle:** The app should never crash completely; it should degrade gracefully.

- **Global Boundary:** The app root must be wrapped in a Global Error Boundary.
- **Fallback UI:** Never show a "White Screen of Death". Always display a user-friendly error message with a retry mechanism.

## 8. Testing

**Principle:** Test behavior and critical paths, not implementation details.

- **Unit Tests:** Required for all business logic (hooks, utils).
- **Integration Tests:** Validate key user flows (e.g., Login, Sign Up).
- **Smoke Tests:** Ensure basic UI components render without crashing.
