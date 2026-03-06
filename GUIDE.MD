# LLM Contributor Guide

This guide tells an LLM how to make high-quality changes in `base-ui-rn` while matching the repository’s conventions.

## 1) Repository map

- Monorepo managed with `pnpm` workspaces.
- Core code lives in `packages/*`.
  - Primitive packages (for example `button`, `toggle`, `avatar`) expose headless React Native components.
  - `packages/core` contains shared accessibility/behavior utilities.
  - `packages/test-utils` contains shared testing helpers.
  - `packages/playbook` contains visual demo primitives used by the playground app.
- Playground app lives in `apps/playground` and is used for manual verification + e2e flows.

## 2) Ground rules for any change

1. Make the smallest coherent change that solves the task.
2. Preserve accessibility behavior and keyboard interactions.
3. Keep components headless (avoid forcing opinionated UI styles).
4. Prefer existing utilities from `@base-ui-rn/core` and `@base-ui-rn/test-utils` over reimplementation.
5. Update tests for behavior changes; do not rely on manual verification only.
6. Keep naming and file layout consistent with neighboring packages.

## 3) Code style conventions to follow

### TypeScript + React Native

- Use named exports for primitives (`export const Button = ...`), then re-export from `src/index.ts`.
- Use `import * as React from 'react';` style imports.
- Prefer explicit type imports from `react-native` and local `types.ts`.
- Prefer `React.memo(React.forwardRef(...))` for primitive components.
- Set `displayName` on exported memoized components.
- Keep handlers stable via `React.useCallback` when passed to components.
- Use `React.useMemo` for derived objects/arrays passed as props.
- Keep accessibility defaults explicit (role, hint, state, actions).

### Formatting + linting

- Follow existing Prettier/ESLint style (single quotes, trailing commas, concise comments).
- Avoid introducing new lint rule exceptions unless absolutely required.
- Keep package-level scripts intact (`lint` usually runs `eslint . --fix && tsc --noEmit`).

## 4) JSDoc conventions

Use compact, practical JSDoc comments similar to existing primitives:

- Component-level block describing purpose + behavior.
- Include `@example` for public primitives when useful.
- For props and types, describe semantics and include `@default` where behavior has defaults.
- For callbacks, document payload meaning, not just type shape.

Recommended style:

```ts
/**
 * Headless XYZ primitive built on top of React Native `SomeBase`.
 *
 * Supports keyboard interaction, accessibility roles, and focus behavior.
 *
 * @example
 * ```tsx
 * <Xyz onChange={...}>...</Xyz>
 * ```
 */
```

## 5) Creating a new component package (playbook included)

When asked to add a new primitive, mirror existing packages:

1. Create `packages/<name>/` with:
   - `package.json`
   - `tsconfig.json`
   - `eslint.config.js`
   - `src/<name>.tsx`
   - `src/types.ts`
   - `src/index.ts`
   - `src/__tests__/*.test.tsx`
2. Add dependencies using workspace references where appropriate (for example `@base-ui-rn/core`, `@base-ui-rn/test-utils`).
3. Export from `src/index.ts` in the same style used by neighboring packages.
4. Implement accessibility-first behavior:
   - reasonable role defaults
   - `accessibilityState` merging
   - keyboard activation support where relevant
   - focusability rules for disabled state
5. Add/extend tests:
   - rendering
   - accessibility
   - keyboard interaction
   - state transitions
   - disabled behavior
   - ref forwarding (if component forwards refs)

## 6) Creating or updating playbooks

For each user-facing primitive, keep playground demos current.

### Add a playbook file

- Create `apps/playground/src/<name>.playbook.tsx`.
- Use `Gallery` + `Section` from `@base-ui-rn/playbook`.
- Include representative states (default, disabled, interactive, custom behavior).
- Prefer deterministic examples and clear `testID` values.

### Register in the app

- Import the playbook into `apps/playground/App.tsx`.
- Add entry to `REGISTRY` with:
  - `title`
  - `component`
  - `testID`

### Optional e2e coverage

- Add `apps/playground/e2e/<name>.yaml` when behavior should be covered by Maestro.

## 7) Testing playbook (what to run)

Run the smallest command set that proves correctness:

1. **Package-local lint/typecheck** for touched package(s):
   - `pnpm --filter @base-ui-rn/<pkg> lint`
2. **Unit tests** when behavior changes:
   - `pnpm test` (root Jest)
   - or targeted Jest runs if available
3. **Playground/e2e checks** for flow or interaction-heavy changes:
   - `pnpm test:e2e` (managed run)
   - `pnpm test:e2e:all` (full Maestro suite)

If CI-like commands are too heavy for local execution, still run the most relevant subset and clearly report what was/wasn’t executed.

## 8) Testing patterns to reuse

- Use `@testing-library/react-native` as the default testing approach.
- Prefer role-based queries and accessibility assertions.
- Reuse helpers from `@base-ui-rn/test-utils`:
  - `renderWithRole`
  - `testAccessibility`
  - `fireKeyPress`
  - `fireAccessibilityAction`
- Keep tests focused on behavior and public API, not implementation details.

## 9) PR/change hygiene for LLMs

Before finalizing:

- Confirm all changed files are intentional.
- Ensure exports are wired correctly.
- Ensure new props/types are documented.
- Ensure tests are updated for changed behavior.
- Ensure playbook examples still run for touched components.
- Provide a concise change summary + command results.

## 10) Definition of done

A change is done when:

- Code follows local structure and style.
- Accessibility and keyboard behavior are preserved or improved.
- Tests cover new/changed behavior.
- Playbook examples exist for user-observable component behavior.
- Lint/typecheck/test commands (relevant subset) have been run and reported.

