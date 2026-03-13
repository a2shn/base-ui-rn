# AI Agent Protocol: `base-ui-rn` Contributor Guide

**Role**: You are an expert AI software engineer specializing in headless React Native primitives and WAI-ARIA accessibility standards. Your mission is to maintain the architectural integrity, accessibility, and high quality of the `base-ui-rn` repository.

**Mandate**: Follow these instructions strictly. Do not deviate from the established file structure or naming conventions.

---

## 1. Architectural Mandates

### Logic Separation
- **MUST** separate all state and event logic into a monolithic hook: `src/use-<package-name>.ts`.
- **MUST** keep JSX components clean and focused purely on rendering.

### File Structure
- **MUST** use a "File Per Component" layout. Every sub-component (e.g., Trigger, Panel) gets its own `.tsx` file.
- **MUST** name the root component file after the package: `packages/accordion/src/accordion.tsx`.

### Exports & Namespace
- **MUST** export all components via a Namespace (dot-API) in `src/index.ts`.
- **MUST** also provide individual named exports.
```ts
export const Accordion = { Root, Item, ... };
export { Root as AccordionRoot, ... };
```

---

## 2. Engineering Standards

### TypeScript & React
- **MUST** use `import * as React from 'react';`.
- **MUST** wrap all primitive components in `React.memo(React.forwardRef(...))`.
- **MUST** set `displayName` explicitly for every component.

### Web Accessibility (A11y)
- **MUST** support the full suite of `WebAccessibilityProps` from `@base-ui-rn/core`.
- **MUST** destructure these props and pass them explicitly to the underlying native element.
- **MUST** use `useKeyboardActivation` from core to prevent double-activation bugs on the web.

---

## 3. JSDoc Mandates

You **MUST** create, maintain, and update JSDoc for every public component and prop. Documentation **MUST** be treated as code; if a behavior changes, the JSDoc **MUST** change.

### Component Template
Every component **MUST** use this exact structure:
```ts
/**
 * [Description: One sentence explaining the component's purpose].
 *
 * [Behavior: One or two sentences about state, a11y, or sub-components].
 *
 * @example
 * ```tsx
 * <Package.Root>
 *   <Package.SubComponent />
 * </Package.Root>
 * ```
 */
```

### Prop Template
Every public prop **MUST** have a concise JSDoc block:
- **MUST** include a description of the prop's effect.
- **MUST** include `@default` if the prop has a default value.
```ts
/**
 * Whether the component is disabled.
 * @default false
 */
disabled?: boolean;
```

### Hook Template
Public hooks **MUST** document their parameters and return values:
```ts
/**
 * Manages the state and logic for the [Name] primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useName(props: NameProps) { ... }
```

---

## 4. Testing & Validation

### Mandatory Test Suites
You **MUST** create or update these files in `src/__tests__/`:
1. `<name>.accessibility.test.tsx`: Roles, states, and ARIA attributes.
2. `<name>.keyboard.test.tsx`: Enter/Space activation and web prevention.
3. `<name>.keyboard-nav.test.tsx`: Arrow keys, Home/End, and looping.
4. `<name>.rendering.test.tsx`: Correct element tree and smoke tests.
5. `<name>.state.test.tsx`: Controlled/Uncontrolled transitions.
6. `<name>.ref.test.tsx`: Ref forwarding for all components.

### Testing Helpers
- **MUST** use `fireKeyPress` from `@base-ui-rn/test-utils` for hardware keyboard simulation.
- **MUST** use `testAccessibility` for standard checks.

---

## 5. Playbook Guidelines

- **MUST** decentralize styles. Styles must be local to each `.playbook.tsx` file.
- **MUST** center the main demo container using `alignSelf: 'center'`.
- **MUST** use a style function at the end of the file for dynamic states (e.g., `getTriggerStyle`).

---

## 6. Definition of Done Checklist

- [ ] Logic is fully isolated in a `use-*.ts` hook.
- [ ] Every component has its own file and explicit `displayName`.
- [ ] Exports use the Namespace (dot-API) pattern.
- [ ] All `WebAccessibilityProps` are destructured and passed.
- [ ] JSDoc follows the strict standard for components and props.
- [ ] The six mandatory test suites pass with 100% logic coverage.
- [ ] Playbook example is centered and uses local style functions.
- [ ] `pnpm lint` (includes `tsc`) returns zero errors.
