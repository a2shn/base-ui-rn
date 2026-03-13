# Agent Contributor Guide

This guide is for AI Agents/LLMs to maintain high-quality standards in the `base-ui-rn` repository.

## 1) Repository map

- Monorepo managed with `pnpm` workspaces.
- Core code lives in `packages/*`.
  - Primitive packages (e.g., `button`, `toggle`, `avatar`, `accordion`) expose headless React Native components.
  - `packages/core` contains shared accessibility, keyboard, and behavior utilities.
  - `packages/test-utils` contains shared testing helpers.
  - `packages/playbook` contains visual demo primitives used by the playground app.
- Playground app lives in `apps/playground` and is used for manual verification + e2e flows.

## 2) Ground rules for any change

1. Make the smallest coherent change that solves the task.
2. **Comprehensive Accessibility**: Always support `WebAccessibilityProps` from `@base-ui-rn/core`. Destructure them and pass them explicitly to the underlying React Native components.
3. **Keyboard Interactivity**: Preserve and enhance keyboard behavior (arrows, loop focus, activation prevention on web).
4. **Headless & Unstyled**: Keep components logic-focused; avoid forcing opinionated UI styles.
5. **Logic Separation**: Use `use-<name>.ts` hooks to separate concerns from the JSX components.
6. **File Per Component**: Each sub-component (e.g., Root, Trigger, Panel) MUST reside in its own file.
7. **Namespace Export**: Export components via a namespace (dot-API) in `src/index.ts`.

## 3) Code style conventions

### File Structure & Exports

- **Hook**: `src/use-<name>.ts` contains all state and event logic.
- **Root**: `src/<name>.tsx` contains the Root component.
- **Sub-components**: `src/<sub-component>.tsx` (e.g., `src/trigger.tsx`, `src/panel.tsx`).
- **Entry**: `src/index.ts` exports everything:
  ```ts
  import { AccordionRoot } from './accordion';
  import { AccordionItem } from './item';
  // ...
  export const Accordion = {
    Root: AccordionRoot,
    Item: AccordionItem,
    // ...
  };
  export * from './types';
  ```

### TypeScript + React Native

- Use `import * as React from 'react';`.
- Prefer explicit type imports from `react-native` and local `types.ts`.
- Components should be `React.memo(React.forwardRef(...))`.
- Use `useCallback` for stable handlers and `useMemo` for derived props.
- Ensure all components handle `data-` and `aria-` props from `WebAccessibilityProps`.

## 4) Accessibility Standards

- **Core Coverage**: `WebAccessibilityProps` includes `tabIndex`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-details`, `aria-expanded`, `aria-busy`, `aria-hidden`, and more.
- **Activation Fix**: Use `useKeyboardActivation` from `@base-ui-rn/core` to prevent double-activation on Web (it calls `e.preventDefault()`).
- **Focus States**: Integrate `useFocus` from `@base-ui-rn/focus-ring` and apply `DEFAULT_FOCUS_RING_STYLE` when `focusVisible` is true.

## 5) Creating or updating playbooks

- **Decentralized Styles**: NEVER use shared `playbookStyles.ts`. Each playbook file MUST contain its own `StyleSheet`.
- **Centering**: Use `alignSelf: 'center'` on the main demo container within a `Section`.
- **Dynamic Styling**: For state-dependent styles (like `open` or `pressed`), define a style function at the end of the file:
  ```ts
  function getTriggerStyle({ open, disabled }: AccordionTriggerState) {
    return [
      styles.trigger,
      open ? styles.triggerOpen : styles.triggerDefault,
      disabled && styles.disabled,
    ];
  }
  ```

## 6) Testing Requirements

- **Unit Tests**: Update tests for any behavior changes. Import components from `../index` (the dot-API).
- **Keyboard Navigation**: Verify arrow keys, Home/End, and looping behavior using `fireKeyPress`.
- **Commands**:
  - Package Lint: `pnpm --filter @base-ui-rn/<pkg> lint` (includes `tsc`).
  - Package Tests: `pnpm test packages/<pkg>`

## 7) Definition of done for Agents

- Code follows the "File Per Component" and "Logic in Hook" structure.
- `src/index.ts` uses the Namespace (dot-API) export pattern.
- All `WebAccessibilityProps` are destructured and passed to the base component.
- Playbook demo is centered and uses local, dynamic style functions.
- `pnpm lint` and unit tests pass with 100% coverage for the new logic.
