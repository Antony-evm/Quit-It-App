# Codebase Improvement Plan

Based on an analysis of the codebase against `MAINTAINABILITY_TIPS.md`, here are the critical areas for improvement, ranked by their impact on maintainability and stability.

## 1. Loose TypeScript Configuration & Widespread `any` Usage

**Why it's a problem:**
The `tsconfig.json` does not explicitly enable `"strict": true`, and there is significant usage of the `any` type throughout the codebase (e.g., in `useInfiniteTrackingRecords.ts`, `scrollManager.ts`, and `StartupNavigationHandler.tsx`).

- **False Security:** You are paying the cost of writing TypeScript but getting limited safety benefits.
- **Runtime Errors:** Critical data structures like API responses (`oldData: any`) and navigation parameters (`params?: any`) are untyped, which can lead to "undefined is not an object" crashes that TypeScript would otherwise catch.
- **Refactoring Risk:** Changing a data structure won't trigger compiler errors in places where `any` is used, making refactoring dangerous.

## 2. Missing Global Error Boundary

**Why it's a problem:**
While there is a sophisticated `ErrorHandlerProvider` for logic and API errors, there is no React **Error Boundary** component wrapping the application.

- **White Screen of Death:** If a component throws an error during rendering (e.g., accessing a property on null), the entire React tree will unmount, and the user will see a blank white screen or a native crash.
- **No Fallback UI:** Users have no way to recover or even know what happened. The `ErrorHandlerContext` cannot catch render-phase errors.

## 3. Inadequate Automated Testing Strategy

**Why it's a problem:**
The codebase contains only two test files (`App.test.tsx` and `dateUtils.test.ts`) for a feature-rich application containing Auth, Questionnaire, Tracking, and Paywall features.

- **Regression Bugs:** You cannot confidently modify complex logic (like the `useAuthForm` hook or `tracking` calculations) without manually testing every scenario.
- **Documentation Gap:** Tests often serve as documentation for how edge cases are handled; without them, that knowledge is lost.
- **Violation of Tip #9:** The tip explicitly calls for Unit, Integration, and E2E tests, which are largely missing.

## 4. Lack of Automated Code Quality Enforcement

**Why it's a problem:**
Although `eslint` and `prettier` are installed, there are no pre-commit hooks configured (e.g., `husky` or `lint-staged`) in `package.json`.

- **Inconsistent Codebase:** Developers can commit code that violates linting rules or formatting standards.
- **Technical Debt Accumulation:** Without enforcement, "strict rules" become "optional suggestions," leading to a gradual decline in code quality and harder-to-read diffs.

## 5. Compromised Navigation Type Safety

**Why it's a problem:**
While `RootStackParamList` is defined, several hooks and components bypass this safety by typing navigation props as `any` (e.g., `navigation: any` in `useUserStatusUpdate.ts`).

- **Broken Links:** You lose the ability to validate that you are navigating to valid routes with the correct parameters.
- **Autocomplete Failure:** Developers won't get suggestions for route names, increasing the chance of typos (e.g., navigating to "Home" instead of "HomeScreen").

## 6. Ambiguous Styling Source of Truth

**Why it's a problem:**
The codebase contains a `global.css` file (which appears unused) alongside a TypeScript theme system that exports both `BRAND_COLORS` (raw values) and `COLOR_PALETTE` (tokens).

- **Inconsistency:** Components like `AuthScreen` use `BRAND_COLORS.inkDark` (raw color) instead of a semantic token like `colors.background`. This makes theming (e.g., adding Dark Mode) difficult because colors are hardcoded to specific brand values rather than their functional role.
- **Confusion:** The presence of `global.css` creates ambiguity about the preferred styling method for new developers.
