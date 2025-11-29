# Development Rules

These are the strict rules that must be followed when contributing to this codebase.

## 1. Strict TypeScript & No `any`

- **Rule:** The `tsconfig.json` must have `"strict": true`.
- **Rule:** The `any` type is strictly forbidden. Use `unknown` for dynamic types and narrow them, or define proper interfaces.
- **Rule:** All functions and hooks must have explicit return types.

## 2. Global Error Handling

- **Rule:** The application must be wrapped in a Global Error Boundary to catch render-phase errors.
- **Rule:** Do not allow "White Screen of Death" scenarios; always provide a fallback UI.

## 3. Type-Safe Navigation

- **Rule:** All navigation must be typed using `RootStackParamList`.
- **Rule:** Never use `navigation: any` or `route: any`.
- **Rule:** Use typed hooks (e.g., `useAppNavigation`) instead of raw `useNavigation`.

## 4. Centralized & Typed Design System

- **Rule:** Use the centralized `theme` object for all styling.
- **Rule:** No hardcoded colors or magic numbers in styles.
- **Rule:** Use semantic tokens (e.g., `colors.background`) instead of raw values.

## 5. Feature-Based Architecture

- **Rule:** Code must be organized by feature (e.g., `src/features/auth`), not by file type.
- **Rule:** Each feature must have a public API (`index.ts`) and keep internals private.

## 6. Separation of Concerns

- **Rule:** Business logic must be extracted into custom hooks.
- **Rule:** UI components should be presentational and logic-free where possible.

## 7. Centralized API Management

- **Rule:** All API calls must be defined in the `api` folder.
- **Rule:** Use React Query for server state management; do not manage loading/error states manually in components.

## 8. Atomic Components

- **Rule:** Break large components into smaller, reusable atoms, molecules, and organisms.
- **Rule:** Define strict interfaces for all component props.

## 9. Automated Testing

- **Rule:** Critical logic must be unit tested.
- **Rule:** Complex user flows should have integration or E2E tests.

## 10. Code Quality Enforcement

- **Rule:** Code must pass all linting and formatting rules (ESLint/Prettier).
- **Rule:** No unused imports or variables.
