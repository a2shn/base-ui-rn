import { fireEvent, render, RenderResult } from '@testing-library/react-native';
import * as React from 'react';

export { fireEvent };

export const DEFAULT_HINT = 'Triggers an action';

/**
 * Helper to render a component and get the element by role
 */
export function renderWithRole<T extends string>(
  component: React.ReactElement,
  role?: T,
): RenderResult & {
  getElement: (r?: T) => ReturnType<RenderResult['getByRole']>;
} {
  const result = render(component);
  return {
    ...result,
    getElement: (r?: T) => result.getByRole((r || role || 'button') as T),
  };
}

/**
 * Interface for comprehensive accessibility testing
 */
export interface AccessibilityTestOptions {
  label?: string;
  hint?: string;
  disabled?: boolean;
  checked?: boolean;
  busy?: boolean;
  selected?: boolean;
  focusable?: boolean;
  tabIndex?: number;
  actions?: string[];
  importantForAccessibility?: 'yes' | 'no' | 'no-hide-descendants' | 'auto';
  testID?: string;
}

/**
 * Comprehensive helper to test accessibility traits of a component.
 * Verifies role, label, hint, state, and focusability in one call.
 */
export function testAccessibility(
  element: ReturnType<RenderResult['getByRole']>,
  options: AccessibilityTestOptions,
): void {
  const {
    actions,
    busy,
    checked,
    disabled = false,
    focusable,
    hint,
    importantForAccessibility,
    label,
    selected,
    tabIndex,
  } = options;

  if (label !== undefined) {
    // Note: getByRole usually verifies label via the name option,
    // but we can check the raw prop if needed.
    expect(element.props.accessibilityLabel).toBe(label);
  }

  if (hint !== undefined) {
    expect(element.props.accessibilityHint).toBe(hint);
  }

  const expectedState: Record<string, unknown> = { disabled };
  if (checked !== undefined) expectedState.checked = checked;
  if (busy !== undefined) expectedState.busy = busy;
  if (selected !== undefined) expectedState.selected = selected;

  expect(element.props.accessibilityState).toMatchObject(expectedState);

  if (focusable !== undefined) {
    expect(element.props.focusable).toBe(focusable);
  }

  if (tabIndex !== undefined) {
    expect(element.props.tabIndex).toBe(tabIndex);
  }

  if (importantForAccessibility !== undefined) {
    expect(element.props.importantForAccessibility).toBe(
      importantForAccessibility,
    );
  }

  if (actions !== undefined) {
    actions.forEach((action) => {
      expect(element.props.accessibilityActions).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: action })]),
      );
    });
  }
}

/**
 * Common activation keys used across components
 */
export const ACTIVATION_KEYS = [
  'Enter',
  ' ',
  'Spacebar',
  'Space',
  'Select',
  'Return',
  'OK',
  'Accept',
  'GamepadA',
  'buttonA',
  'buttonX',
  'Cross',
];

/**
 * Non-activation keys that should not trigger state changes
 */
export const NON_ACTIVATION_KEYS = [
  'Tab',
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Escape',
  'Home',
  'End',
  'PageUp',
  'PageDown',
];

/**
 * D-pad/gamepad navigation keys that should not trigger activation
 */
export const DPAD_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
