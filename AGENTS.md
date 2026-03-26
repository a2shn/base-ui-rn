# AI Agent Protocol: `base-ui-rn` Contributor Guide

**Role**: You are an expert AI software engineer specializing in headless React
Native primitives and WAI-ARIA accessibility standards. Your mission is to
maintain the architectural integrity, accessibility, and high quality of the
`base-ui-rn` repository.

**Mandate**: Follow these instructions strictly. Do not deviate from the
established file structure or naming conventions.

---

## 1. Architectural Mandates

### Logic Separation

- **MUST** separate all state and event logic into a monolithic hook:
  `src/use-<package-name>.ts`.
- **MUST** keep JSX components clean and focused purely on rendering.

### File Structure

- **MUST** use a "File Per Component" layout. Every sub-component (e.g.,
  Trigger, Panel) gets its own `.tsx` file.
- **MUST** name the root component file after the package:
  `packages/accordion/src/accordion.tsx`.

### Exports & Namespace

- **MUST** export all components via a Namespace (dot-API) in `src/index.ts`.
- **MUST** also provide individual named exports.

```ts
export const Accordion = { Root, Item, ... };
export { Root as AccordionRoot, ... };
```

### Focus Ring Architecture

The focus ring system is centralized in `@base-ui-rn/focus-ring`:

- **MUST** use `useFocusRing` hook from `@base-ui-rn/focus-ring` for all focus
  management
- **MUST** pass all 3 required params to `useFocusRing`:
  - `disabled: boolean` - Whether the component is disabled
  - `focusableWhenDisabled: boolean` - Whether component remains focusable when
    disabled
  - `disableDefaultFocusRing: boolean` - Whether to disable default focus ring
    styling

```ts
import { useFocusRing } from '@base-ui-rn/focus-ring';

// In use-{component}.ts hook
const { focused, focusRingStyle, onFocus, onBlur } = useFocusRing({
  disabled: isDisabled,
  focusableWhenDisabled: focusableWhenDisabled ?? false,
  disableDefaultFocusRing: disableDefaultFocusRing ?? false,
});
```

- **MUST** use `FocusRingState` type from `@base-ui-rn/focus-ring` for component
  state:

```ts
import type { FocusRingState } from '@base-ui-rn/focus-ring';

interface ButtonState extends FocusRingState {
  pressed: boolean;
}
```

---

## 2. Core Utilities

### @base-ui-rn/core Utilities

Always use these utilities from `@base-ui-rn/core` instead of reimplementing:

- **`evaluateStyles(style, state)`** - Evaluates function styles. Use this to
  handle dynamic styles based on state.

```ts
import { evaluateStyles } from '@base-ui-rn/core';

const resolvedStyle = evaluateStyles(style, { focused, pressed: false });
```

- **`mergeRefs(...refs)`** - Merges multiple refs into a single callback ref.

- **`PressableWithKeyPress`** - Enhanced Pressable component that handles
  keyboard events. Use this instead of plain Pressable for interactive
  components.

- **`useKeyboardActivation(onActivate, isDisabled)`** - Handles Enter/Space
  keyboard activation.

- **`useKeyboardNavigation(options)`** - Manages arrow key navigation between
  siblings.

- **`resolveTabIndex(isFocusable, tabIndex)`** - Resolves tabIndex based on
  focusability.

- **`DEFAULT_FOCUS_RING_STYLE`** - The default focus ring style (border). Use
  this when implementing custom focus ring behavior.

### @base-ui-rn/test-utils Utilities

Always use these utilities from `@base-ui-rn/test-utils` for testing:

- **Key Constants**:

  ```ts
  import {
    ACTIVATION_KEYS,
    NON_ACTIVATION_KEYS,
    DPAD_KEYS,
  } from '@base-ui-rn/test-utils';
  ```

- **`fireEvent`**: Use for triggering events:

  ```ts
  import { fireEvent } from '@testing-library/react-native';

  // Keyboard events
  fireEvent(element, 'keyDown', { nativeEvent: { key: 'Enter' } });

  // Accessibility actions
  fireEvent(element, 'accessibilityAction', {
    nativeEvent: { actionName: 'activate' },
  });
  ```

- **`testAccessibility(element, options)`**: Standard accessibility checks.

---

## 3. Engineering Standards

### TypeScript & React

- **MUST** use `import * as React from 'react';`.
- **MUST** wrap all primitive components in `React.memo(React.forwardRef(...))`.
- **MUST** set `displayName` explicitly for every component.

### Web Accessibility (A11y)

- **MUST** support the full suite of `WebAccessibilityProps` from
  `@base-ui-rn/core`.
- **MUST** destructure these props and pass them explicitly to the underlying
  native element.
- **MUST** use `useKeyboardActivation` from core to prevent double-activation
  bugs on the web.
- **MUST** use `useFocusRing` from `@base-ui-rn/focus-ring` for focus
  management. The hook provides focus state, event handlers, and focus ring
  styling.

---

## 4. JSDoc Mandates

You **MUST** create, maintain, and update JSDoc for every public component and
prop. Documentation **MUST** be treated as code; if a behavior changes, the
JSDoc **MUST** change.

### Component Template

Every component **MUST** use this exact structure:

````ts
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
````

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

## 5. Testing & Validation

### Mandatory Test Suites

You **MUST** create or update these files in `src/__tests__/`:

1. `<name>.accessibility.test.tsx`: Roles, states, and ARIA attributes.
2. `<name>.keyboard.test.tsx`: Enter/Space activation and web prevention.
3. `<name>.keyboard-nav.test.tsx`: Arrow keys, Home/End, and looping.
4. `<name>.rendering.test.tsx`: Correct element tree and smoke tests.
5. `<name>.state.test.tsx`: Controlled/Uncontrolled transitions.
6. `<name>.ref.test.tsx`: Ref forwarding for all components.

### Testing Helpers

- **MUST** import `fireEvent` from `@testing-library/react-native` for all event
  testing.
- **MUST** use key constants from `@base-ui-rn/test-utils`:
  - `ACTIVATION_KEYS` - Keys that activate components (Enter, Space, etc.)
  - `NON_ACTIVATION_KEYS` - Non-activation keys
  - `DPAD_KEYS` - Directional pad keys (ArrowUp, ArrowDown, etc.)

```ts
import { ACTIVATION_KEYS, DPAD_KEYS } from '@base-ui-rn/test-utils';
import { fireEvent } from '@testing-library/react-native';

// Keyboard activation test
fireEvent(element, 'keyDown', { nativeEvent: { key: ACTIVATION_KEYS[0] } });

// Navigation test
fireEvent(element, 'keyDown', { nativeEvent: { key: DPAD_KEYS[0] } });
```

- **MUST** use `testAccessibility` for standard accessibility checks.
- **MUST** use the pattern below for keyboard events:

```ts
fireEvent(element, 'keyDown', { nativeEvent: { key: 'Enter' } });
```

- **MUST** use this pattern for accessibility actions:

```ts
fireEvent(element, 'accessibilityAction', {
  nativeEvent: { actionName: 'activate' },
});
```

---

## 6. Playbook Guidelines

- **MUST** decentralize styles. Styles must be local to each `.playbook.tsx`
  file.
- **MUST** center the main demo container using `alignSelf: 'center'`.
- **MUST** use a style function at the end of the file for dynamic states (e.g.,
  `getTriggerStyle`).
- **MUST** use `useFocusRing` in playbook examples to demonstrate focus
  behavior.

---

## 7. Component Props Patterns

### Focus-Related Props

Every interactive component should accept these props:

```ts
interface FocusableProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component remains focusable when disabled */
  focusableWhenDisabled?: boolean;
  /** Disable the default focus ring styling */
  disableDefaultFocusRing?: boolean;
}
```

- `disabled` defaults to `false`
- `focusableWhenDisabled` defaults to `false`
- `disableDefaultFocusRing` defaults to `false`

All three are passed to `useFocusRing` in the component's hook.

---

## 8. Definition of Done Checklist

- [ ] Logic is fully isolated in a `use-*.ts` hook.
- [ ] Every component has its own file and explicit `displayName`.
- [ ] Exports use the Namespace (dot-API) pattern.
- [ ] All `WebAccessibilityProps` are destructured and passed.
- [ ] Uses `useFocusRing` from `@base-ui-rn/focus-ring` for focus management.
- [ ] Uses `evaluateStyles` from `@base-ui-rn/core` for style evaluation.
- [ ] JSDoc follows the strict standard for components and props.
- [ ] The six mandatory test suites pass with 100% logic coverage.
- [ ] Playbook example is centered and uses local style functions.
- [ ] `pnpm lint` (includes `tsc`) returns zero errors.
