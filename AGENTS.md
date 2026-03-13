# Agent Contributor Guide

This guide is for AI Agents/LLMs to maintain high-quality standards in the `base-ui-rn` repository.

## 1) Repository Map & Project Structure

The project is a monorepo managed with `pnpm` workspaces.

### Core Architecture
- **`packages/*`**: Contains all library code.
  - **`packages/core`**: The backbone of the library. Contains shared accessibility logic, keyboard navigation hooks, common constants, and TypeScript definitions.
  - **`packages/test-utils`**: Shared testing infrastructure. Provides custom matchers, rendering helpers, and event simulators.
  - **`packages/focus-ring`**: Specialized logic for focus-visible detection and styling.
  - **`packages/playbook`**: UI primitives used exclusively for building the playground app demos.
- **`apps/playground`**: An Expo-based React Native app for manual testing and visual verification.

### Package Anatomy
Every primitive package (e.g., `packages/accordion`) follows a strict file-per-concern layout:
- `src/index.ts`: The entry point. Exports the Namespace (dot-API) and all types.
- `src/<package-name>.tsx`: The Root component implementation.
- `src/<sub-component>.tsx`: Individual files for every sub-component (Trigger, Panel, etc.).
- `src/use-<package-name>.ts`: A monolithic hook containing all business logic, state management, and event handlers.
- `src/types.ts`: TypeScript interfaces for props and internal state.
- `src/context.tsx`: React Context for parent-child communication.
- `src/__tests__/`: Comprehensive unit test suites.

## 2) Code Style Conventions

### File Structure & Exports
Each package MUST expose its components via a dot-API namespace:
```ts
// src/index.ts
import { AccordionRoot } from './accordion';
import { AccordionItem } from './item';

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  // ...
};
```

### Component Implementation
- Use `import * as React from 'react';`.
- Always use `React.memo(React.forwardRef(...))` for all components.
- Destructure `WebAccessibilityProps` (e.g., `aria-label`, `tabIndex`) and pass them to the base `View`/`Text`/`Pressable`.
- Keep JSX clean by offloading logic to the `use-<name>.ts` hook.

## 3) Accessibility & Keyboard Standards

- **A11y Props**: Support the full suite of `WebAccessibilityProps` from `@base-ui-rn/core`.
- **Keyboard Activation**: Use `useKeyboardActivation` from core. This utility handles `Enter`/`Space` and calls `e.preventDefault()` on Web to prevent double-activation bugs.
- **Navigation**: Use `useKeyboardNavigation` for components requiring arrow key movement (e.g., Accordion, ToggleGroup).
- **Focus**: Integrate `useFocus` from `@base-ui-rn/focus-ring` and apply `DEFAULT_FOCUS_RING_STYLE` when `focusVisible` is true.

## 4) Testing Structure & Standards

Tests are located in `src/__tests__/` and are partitioned by concern.

### Required Test Suites
1.  **`<name>.accessibility.test.tsx`**: Verifies ARIA roles, states (disabled, expanded, etc.), and ensures all `WebAccessibilityProps` are correctly applied.
2.  **`<name>.keyboard.test.tsx`**: Tests activation (Enter/Space) and specific keyboard flows.
3.  **`<name>.keyboard-nav.test.tsx`**: (If applicable) Tests arrow key navigation, Home/End, and `loopFocus` behavior.
4.  **`<name>.rendering.test.tsx`**: Basic smoke tests and snapshot-like logic checks.
5.  **`<name>.state.test.tsx`**: Verifies internal state transitions and controlled vs. uncontrolled behavior.
6.  **`<name>.ref.test.tsx`**: Ensures all exported components correctly forward their refs to the underlying native view.

### Recommended Test Helpers
Always use helpers from `@base-ui-rn/test-utils` instead of raw `fireEvent`:
- `fireKeyPress(element, key)`: Simulates a hardware keyboard press.
- `testAccessibility(element)`: Runs a standard suite of accessibility checks.
- `renderWithRole(role)`: Query-focused rendering helper.

### Testing Philosophy
- **Behavior First**: Test what the component *does*, not how it works internally.
- **ARIA Driven**: Assert on `aria-*` and `data-*` attributes as they are the source of truth for the headless state.
- **Hardware Integration**: Use `fireKeyPress` to verify that components respond to physical keyboard inputs correctly.

## 5) Playbook Guidelines

- **Self-Contained**: Playbooks must not depend on external shared styles.
- **Centered**: Use `alignSelf: 'center'` on demo containers to prevent layout shifts.
- **State Styling**: Use style functions for dynamic states:
  ```ts
  function getTriggerStyle({ open, focusVisible }: AccordionTriggerState) {
    return [
      styles.trigger,
      open && styles.open,
      focusVisible && DEFAULT_FOCUS_RING_STYLE
    ];
  }
  ```

## 6) Definition of Done for Agents

- [ ] Each component has its own file.
- [ ] All logic resides in a `use-*.ts` hook.
- [ ] Components are exported via dot-API namespace.
- [ ] `WebAccessibilityProps` are fully supported and passed through.
- [ ] Tests cover: A11y, Keyboard, Navigation, Rendering, State, and Ref.
- [ ] Playbook example is added/updated and visually stable.
- [ ] `pnpm lint` and all unit tests pass.
