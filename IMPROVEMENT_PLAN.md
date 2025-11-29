# Codebase Improvement Plan

Based on an analysis of the codebase against `rules.md`, here are the remaining critical areas for improvement.

## 1. Inadequate Automated Testing Strategy

**Why it's a problem:**
The codebase contains only two test files (`App.test.tsx` and `dateUtils.test.ts`) for a feature-rich application containing Auth, Questionnaire, Tracking, and Paywall features.

- **Regression Bugs:** You cannot confidently modify complex logic (like the `useAuthForm` hook or `tracking` calculations) without manually testing every scenario.
- **Documentation Gap:** Tests often serve as documentation for how edge cases are handled; without them, that knowledge is lost.
- **Violation of Rule #9:** The rule explicitly calls for Unit, Integration, and E2E tests, which are largely missing.

## 2. Lack of Automated Code Quality Enforcement

**Why it's a problem:**
Although `eslint` and `prettier` are installed, there are no pre-commit hooks configured (e.g., `husky` or `lint-staged`) in `package.json`.

- **Inconsistent Codebase:** Developers can commit code that violates linting rules or formatting standards.
- **Technical Debt Accumulation:** Without enforcement, "strict rules" become "optional suggestions," leading to a gradual decline in code quality and harder-to-read diffs.

## 3. Ambiguous Styling Source of Truth

**Why it's a problem:**
The codebase contains a `global.css` file (which appears unused) alongside a TypeScript theme system that exports both `BRAND_COLORS` (raw values) and `COLOR_PALETTE` (tokens).

- **Inconsistency:** Components like `AuthScreen` use `BRAND_COLORS.inkDark` (raw color) instead of a semantic token like `colors.background`. This makes theming (e.g., adding Dark Mode) difficult because colors are hardcoded to specific brand values rather than their functional role.
- **Confusion:** The presence of `global.css` creates ambiguity about the preferred styling method for new developers.
