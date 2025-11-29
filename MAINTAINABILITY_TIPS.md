# Top 10 Tips for Maintainable React Native & TypeScript Code

Here are the top 10 tips for writing scalable, maintainable, and robust React Native applications with TypeScript, ranked with a high priority on CSS/Styling maintainability.

## 1. Centralized & Typed Design System (High CSS Maintainability)

The biggest source of technical debt in UI code is inconsistent styling (magic numbers, scattered hex codes).

- **Single Source of Truth:** Define a `theme` object containing your **Colors**, **Spacing**, **Typography**, and **Border Radii**.
- **TypeScript Integration:** Create a `Theme` type. If you use `styled-components` or `Shopify Restyle`, extend the default theme type so you get autocomplete for your design tokens.
- **Avoid Hardcoded Values:** Never use `margin: 10` or `color: '#333'`. Use `margin: theme.spacing.m` or `color: theme.colors.textPrimary`.
- **StyleSheet vs. Styled Components:** Whichever you choose, be consistent. If using `StyleSheet`, consider creating a helper hook like `useThemeStyles` to inject theme tokens dynamically.

## 2. Strict TypeScript Configuration

A loose type system defeats the purpose of using TypeScript.

- **Enable Strict Mode:** Set `"strict": true` in your `tsconfig.json`. This enables `noImplicitAny`, `strictNullChecks`, and more.
- **Avoid `any`:** Treat `any` as a bug. Use `unknown` if the type is truly dynamic, and narrow it down with type guards.
- **Explicit Return Types:** Define return types for your functions and hooks to prevent accidental API changes.

## 3. Feature-Based Folder Structure

Organizing by file type (e.g., all components in one folder, all screens in another) scales poorly.

- **Colocation:** Group related files by **Feature** (e.g., `src/features/auth`, `src/features/dashboard`).
- **Encapsulation:** Each feature folder should have its own `components`, `hooks`, `api`, and `types`.
- **Public API:** Use an `index.ts` file in each feature folder to export only what is needed by the rest of the app, keeping internal implementation details private.

## 4. Type-Safe Navigation

Navigation bugs are common and hard to debug without types.

- **Define Param Lists:** Create strict interfaces for your navigation stacks (e.g., `RootStackParamList`).
- **Typed Hooks:** Do not use the default `useNavigation()`. Create typed wrappers like `useAppNavigation` and `useAppRoute` so you get autocomplete for route names and route parameters.
- **No Magic Strings:** Use an enum or constant object for Route Names.

## 5. Separation of Concerns (Logic vs. UI)

Keep your TSX files clean and focused on rendering.

- **Custom Hooks:** Move business logic, `useEffect` calls, and complex state management into custom hooks (e.g., `useLoginController` instead of putting logic inside `LoginScreen`).
- **Presentational Components:** Dumb components should only receive data via props and emit events via callbacks.

## 6. Centralized API & Server State Management

Avoid scattering `fetch` or `axios` calls throughout your components.

- **API Layer:** Create a dedicated `api` folder where all endpoints are defined.
- **React Query (TanStack Query):** Use a library like React Query to handle caching, loading states, error states, and re-fetching. It drastically reduces the amount of `useEffect` and `useState` boilerplate code.

## 7. Atomic Component Design

Don't build massive "God Components".

- **Composition:** Break UI down into **Atoms** (Buttons, Text), **Molecules** (FormFields, ListItems), and **Organisms** (Forms, Headers).
- **Prop Interfaces:** Define clear, strict interfaces for component props. Use `Pick` or `Omit` to derive props from existing types to avoid duplication.

## 8. Global Error Handling & Boundaries

Apps crash. Handle it gracefully.

- **Error Boundaries:** Wrap your app (or specific features) in Error Boundaries to catch render errors and show a fallback UI instead of a white screen.
- **Centralized Logging:** Use a service (like Sentry or a custom logger) to capture exceptions.

## 9. Automated Testing Strategy

Manual testing is slow and error-prone.

- **Unit Tests:** Test utility functions and complex hooks (using `renderHook`).
- **Integration Tests:** Use `React Native Testing Library` to test how components interact with the user (pressing buttons, entering text).
- **E2E Tests:** Use Maestro or Detox for critical user flows (Login, Checkout).

## 10. Consistent Code Style & Linting

Maintainability requires consistency across the team.

- **Prettier:** Enforce code formatting (indentation, quotes, semicolons).
- **ESLint:** Use strict rules, specifically `eslint-plugin-react-hooks` to catch missing dependencies in `useEffect`.
- **Husky:** Use pre-commit hooks to run the linter and type checker before code is committed.
