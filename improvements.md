# Improvements & Issues to Address

This document outlines specific issues found in the codebase that conflict with the principles defined in `rules.md`, with a focus on the **Component Design System** and other critical areas.

---

## 🎨 1. Component Design System Issues (Section 3)

### 1.1 Missing `Box` Primitive

**Rule Violated:** _"Primitives: Simple, styled RN elements (`Box`, `Text`, `Button`) wrapping `View`/`Text`."_

**Current State:**

- `AppText` ✅ exists
- `AppButton` ✅ exists
- `Box` ❌ **missing**

**Issue:** The rules explicitly mention a `Box` primitive that wraps `View`, but no such component exists in `src/shared/components/ui/`. Components currently use raw `View` imports directly.

**Recommendation:**
Create a `Box.tsx` primitive component that:

- Wraps React Native's `View`
- Accepts theme-aware spacing props (e.g., `p`, `m`, `gap` using `SPACING` tokens)
- Supports background color tokens from `COLOR_PALETTE`
- Reduces boilerplate and enforces consistent styling

```tsx
// Example API
<Box p="lg" m="md" bg="backgroundPrimary" gap="sm">
  <AppText>Content</AppText>
</Box>
```

---

### 1.2 Hardcoded `borderRadius` Values (Centralized Theme Violation)

**Rule Violated:** _"All styles must use the centralized `theme` object. No magic numbers or hardcoded hex codes."_

**Current State:** `BORDER_RADIUS` tokens exist in `src/shared/theme/borderRadius.ts`:

```ts
BORDER_RADIUS = {
  none: 0,
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
  round: 50,
  full: 999,
};
```

**Issue:** Despite having these tokens, **20+ files** use hardcoded `borderRadius` values:

| File                        | Hardcoded Value           | Should Use                             |
| --------------------------- | ------------------------- | -------------------------------------- |
| `AppButton.tsx`             | `borderRadius: 24`        | `BORDER_RADIUS.xlarge`                 |
| `AppSurface.tsx`            | `borderRadius: 16`        | `BORDER_RADIUS.large`                  |
| `AppTextInput.tsx`          | `borderRadius: 12`        | `BORDER_RADIUS.medium`                 |
| `Toast.tsx`                 | `borderRadius: 12`        | `BORDER_RADIUS.medium`                 |
| `BackArrow.tsx`             | `borderRadius: 22`        | Custom token or `BORDER_RADIUS.xlarge` |
| `DeveloperMenu.tsx`         | `borderRadius: 8, 12, 16` | `BORDER_RADIUS.small/medium/large`     |
| `CravingChart.tsx`          | `borderRadius: 6, 8, 12`  | `BORDER_RADIUS.small/medium`           |
| `NotesCard.tsx`             | `borderRadius: 4`         | New `BORDER_RADIUS.xs` or `small`      |
| `QuestionnaireSkeleton.tsx` | `borderRadius: 4`         | New `BORDER_RADIUS.xs`                 |
| `QuestionnaireTemplate.tsx` | `borderRadius: 0, 4, 999` | `BORDER_RADIUS.none/xs/full`           |
| `ErrorFallback.tsx`         | `borderRadius: 8`         | `BORDER_RADIUS.small`                  |

**Recommendation:**

1. Add a `BORDER_RADIUS.xs = 4` token for small rounded corners
2. Refactor all files to import and use `BORDER_RADIUS` tokens
3. Consider adding an ESLint rule to flag hardcoded `borderRadius` numbers

---

### 1.3 Skeleton Loader Not in UI Primitives

**Rule Violated:** _"Skeletons must be reusable and part of the UI primitives."_

**Current State:** `SkeletonItem` only exists in `src/features/questionnaire/components/QuestionnaireSkeleton.tsx`

**Issue:** The skeleton component is feature-specific, not a shared primitive. Other features cannot easily reuse it.

**Recommendation:**

1. Extract `SkeletonItem` to `src/shared/components/ui/Skeleton.tsx`
2. Export it from `src/shared/components/ui/index.ts`
3. Make it more configurable (animation duration, colors, shapes)
4. Create skeleton variants: `SkeletonText`, `SkeletonCircle`, `SkeletonCard`

---

### 1.4 `style?: any` Props Violate TypeScript Rules

**Rule Violated:** _"The `any` type is forbidden."_ (Section 2)

**Files with `style?: any`:**

- `src/shared/components/ui/CustomPasswordStrengthIndicator.tsx` (line 10)
- `src/features/questionnaire/components/QuestionnaireSkeleton.tsx` (line 13)

**Recommendation:**
Replace with proper types:

```tsx
style?: StyleProp<ViewStyle>;
```

---

### 1.5 Missing Accessibility Labels

**Rule Violated:** _"All interactive components must have proper accessibility labels."_ (Section 6.5)

**Current State:** Only `AppButton.tsx` has `accessibilityRole="button"`. Other interactive components lack accessibility attributes.

**Components Missing Accessibility:**

- `AppTextInput.tsx` - No `accessibilityLabel` or `accessibilityHint`
- `BackArrow.tsx` - Interactive but no accessibility props
- `DraggableModal.tsx` - Interactive modal without accessibility
- Feature-specific buttons and inputs

**Recommendation:**

1. Add `accessibilityLabel` prop to all interactive UI primitives
2. Provide sensible defaults where possible
3. Document accessibility requirements for component consumers

---

## 🛑 2. TypeScript & Code Quality Issues (Section 2)

### 2.1 Widespread `any` Type Usage

**Rule Violated:** _"The `any` type is forbidden."_

**Critical Files (20+ occurrences):**

| File                     | Usage                            |
| ------------------------ | -------------------------------- |
| `ErrorHandlerService.ts` | `error: any` on multiple methods |
| `ErrorFactory.ts`        | `error?: any`, `error: any`      |
| `ErrorContext.tsx`       | `handleError: (error: any, ...)` |
| `authenticatedFetch.ts`  | `data?: any` on API methods      |
| `authBootstrap.ts`       | `stytchClient: any`              |
| `auth/types.ts`          | `[key: string]: any`             |
| `fetchFrequency.ts`      | `[key: string]: any`             |

**Recommendation:**

1. Create proper interfaces for error objects: `interface AppErrorInput { message: string; code?: string; ... }`
2. Use generics for API methods: `<TResponse, TData = unknown>`
3. Type the Stytch client properly or create a wrapper type
4. Replace `[key: string]: any` with `Record<string, unknown>` and narrow appropriately

---

### 2.2 `console.log` in Production Code

**Rule Violated:** _"No `console.log` in production."_

**Files with console.log (non-dev):**

- `authenticatedFetch.ts` - API request logging
- `ErrorHandlerService.ts` - Error retry logging
- `ErrorLogger.ts` - Remote logging simulation
- `useUserDataDebug.ts` - Debug hook (should be dev-only)

**Recommendation:**

1. Wrap all console statements in `__DEV__` checks
2. Replace direct `console.log` with the existing `ErrorLogger` service
3. Remove or gate `useUserDataDebug.ts` to development only

---

## 🧭 3. Theme Consistency Issues

### 3.1 `FOOTER_LAYOUT` Uses Magic Numbers

**File:** `src/shared/theme/layout.ts`

```ts
export const FOOTER_LAYOUT = {
  FAB_SIZE: 64, // Should reference SPACING or new SIZE tokens
  FAB_BORDER_RADIUS: 32, // Should be BORDER_RADIUS.round or custom
  FAB_OFFSET: -32, // Magic number
  FAB_BORDER_WIDTH: 5, // Should be BORDER_WIDTH token
  CONTAINER_BORDER_WIDTH: 3,
  CONTAINER_BORDER_RADIUS: 30, // Should be BORDER_RADIUS token
  ICON_SIZE: 28, // Should be ICON_SIZE token
  PLUS_ICON_SIZE: 32,
};
```

**Recommendation:**

1. Create `ICON_SIZES` token set
2. Create `BORDER_WIDTH` token set
3. Reference existing tokens or extend theme system

---

### 3.2 Questionnaire Layout Constants Bypass Theme

**File:** `src/shared/theme/layout.ts`

```ts
export const QUESTIONNAIRE_HORIZONTAL_PADDING = 24; // SPACING.xl equivalent
```

**Issue:** Comment acknowledges it equals `SPACING.xl` but doesn't use it.

**Recommendation:**

```ts
export const QUESTIONNAIRE_HORIZONTAL_PADDING = SPACING.xl;
```

---

## 🧩 4. Architecture Issues

### 4.1 Centralized API Location Inconsistency

**Rule:** _"All API calls live in `src/api/` or feature-specific `api/` folders."_

**Current State:** There is no `src/api/` folder. All API code is in `src/shared/api/` or feature-specific folders.

**Recommendation:**
Update `rules.md` to accurately reflect the structure:

```md
- **Centralized API:** All shared API utilities live in `src/shared/api/`. Feature-specific endpoints live in `src/features/[feature]/api/`.
```

---

## ✅ 5. Positive Compliance Notes

The following rules are being followed correctly:

| Rule                         | Status                                          |
| ---------------------------- | ----------------------------------------------- |
| Feature-Based Structure      | ✅ `src/features/*` organized properly          |
| Strict TypeScript Mode       | ✅ `tsconfig.json` has `"strict": true`         |
| React Query for Server State | ✅ Used throughout the app                      |
| Global Error Boundary        | ✅ `GlobalErrorBoundary` wraps app root         |
| Navigation Type Safety       | ✅ `RootStackScreenProps` used in screens       |
| Separation of Concerns       | ✅ Hooks separate from UI (e.g., `useAuthForm`) |

---

## 📋 Priority Action Items

### High Priority

1. [ ] **Remove `any` types** - Especially in error handling and API layers
2. [ ] **Migrate to `BORDER_RADIUS` tokens** - Eliminate hardcoded values
3. [ ] **Gate `console.log`** - Wrap in `__DEV__` or use logger

### Medium Priority

4. [ ] **Create `Box` primitive** - Foundational UI component
5. [ ] **Extract `Skeleton` to shared** - Reusable loading states
6. [ ] **Add accessibility props** - To all interactive primitives

### Low Priority

7. [ ] **Refactor `FOOTER_LAYOUT`** - Use theme tokens
8. [ ] **Update `rules.md`** - Reflect actual API folder structure
9. [ ] **Add ESLint rules** - Enforce theme token usage

---

## 📝 Suggested `rules.md` Updates

1. **Section 3:** Add explicit guidance for `Box` primitive props and usage
2. **Section 3:** Add rule: _"All numeric style values for spacing, border-radius, and sizing must use theme tokens"_
3. **Section 4:** Update API location to `src/shared/api/`
4. **Section 6.5:** Add concrete examples of required accessibility props
5. **Add Section 9:** Dark Mode / Theming guidelines (if planned)
