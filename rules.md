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
  - **Primitives:** Simple, styled RN elements (`Box`, `AppText`, `AppButton`) wrapping `View`/`Text`.
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

## 9. Import Organization & Path Aliases

**Principle:** Consistent imports improve readability and reduce merge conflicts.

- **Path Aliases:** Always use `@/` for `src/` imports. Never use deep relative paths like `../../shared/`.
- **Import Order:** Group imports in this order:
  1. React / React Native core
  2. External packages (navigation, query, etc.)
  3. Internal `@/` imports
  4. Relative imports (same feature)
- **No Circular Imports:** Features must not import from each other's internals. Use the public `index.ts` API.

## 10. Internationalization (i18n)

**Principle:** All user-facing text must be translatable from day one.

- **Translation Keys:** All user-visible strings must use `t('key')` from `react-i18next`.
- **Key Naming Convention:** Use dot notation following feature structure: `auth.login.title`, `home.welcome.message`.
- **Exceptions:** Logging messages, error codes, and dev-only content may be hardcoded.
- **Pluralization:** Use i18next's built-in plural handling for countable items.
- **Location:** All translations live in `src/shared/i18n/`.

## 11. Data Persistence & Storage

**Principle:** Sensitive and non-sensitive data require different storage strategies.

- **Sensitive Data:** Use `react-native-keychain` for:
  - Authentication tokens
  - User credentials
  - Any PII (personally identifiable information)
- **Non-Sensitive Data:** Use `AsyncStorage` for:
  - User preferences
  - Cache data
  - App state that doesn't contain secrets
- **Never Store:** Raw passwords, API keys, or sensitive tokens in `AsyncStorage`.
- **Encryption:** Keychain provides OS-level encryption; do not roll custom encryption.

## 12. Service Layer

**Principle:** Complex stateful operations belong in services, not hooks or components.

- **When to Use Services:**
  - Operations requiring caching with persistence
  - Cross-feature coordination
  - Complex business logic with multiple side effects
- **Location:** `src/shared/services/` for shared services, `src/features/[feature]/services/` for feature-specific.
- **Pattern:** Services are singleton classes with static methods. Hooks consume services for React integration.
- **Separation:** Services handle "what to do"; hooks handle "when to do it" (React lifecycle).

## 13. Environment Configuration

**Principle:** Environment-specific values must never be hardcoded.

- **Environment Variables:** Use `react-native-config` for build-time environment variables.
- **Required Variables:** Document all required env vars in a `.env.example` file.
- **Fallbacks:** Always provide sensible defaults for local development.
- **Platform Differences:** Handle Android emulator (`10.0.2.2`) vs iOS simulator (`localhost`) in API configuration.
- **No Secrets in Code:** API keys, secrets, and credentials must come from environment variables or secure storage.

## 14. Logging & Analytics

**Principle:** Production apps need observability without compromising user privacy.

- **Debug Logging:** All `console.log` statements must be gated with `__DEV__` or removed in production.
- **Error Tracking:** Integrate a service (Sentry, Crashlytics) for production error monitoring.
- **User Analytics:** Track key flows (signup completion, feature usage) for product insights.
- **Privacy:** Never log sensitive user data (passwords, tokens, PII).
- **Centralized Logger:** Use `ErrorLogger` service instead of direct `console` calls.

## 15. Animations

**Principle:** Smooth animations enhance UX but must not compromise performance.

- **Simple Animations:** Use React Native's built-in `Animated` API for fade, slide, and scale effects.
- **Native Driver:** Always use `useNativeDriver: true` when possible for 60fps animations.
- **Complex Gestures:** Consider `react-native-reanimated` for gesture-driven or complex choreographed animations.
- **Loading States:** Use subtle animations (pulse, shimmer) for skeleton loaders.
- **Avoid Jank:** Never animate layout properties (`width`, `height`) without native driver support.

## 16. Security

**Principle:** Mobile apps are distributed binaries; assume they can be reverse-engineered.

- **Token Storage:** Store auth tokens in Keychain, never in AsyncStorage or state.
- **Certificate Pinning:** Consider SSL pinning for production API calls.
- **Input Validation:** Validate all user input on both client and server.
- **Sensitive Screens:** Prevent screenshots on sensitive screens (payments, auth) where platform allows.
- **Obfuscation:** Enable ProGuard (Android) and consider additional obfuscation for release builds.

## 17. Code Documentation

**Principle:** Code should be self-documenting, with comments explaining "why" not "what".

- **JSDoc:** Use JSDoc for all public functions, hooks, and component props.
- **README per Feature:** Complex features should have a brief `README.md` explaining architecture decisions.
- **TODO/FIXME:** Use consistent tags for technical debt: `// TODO:`, `// FIXME:`, `// HACK:`.
- **Type as Documentation:** Prefer descriptive type names over comments. `type UserId = number` > `// this is a user id`.

## 18. Git & Version Control

**Principle:** Clean git history enables effective collaboration and debugging.

- **Commit Messages:** Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- **Branch Naming:** Use `feature/`, `fix/`, `refactor/` prefixes.
- **Small PRs:** Keep pull requests focused and reviewable (< 400 lines when possible).
- **No Secrets:** Never commit `.env` files, API keys, or credentials. Use `.gitignore`.
