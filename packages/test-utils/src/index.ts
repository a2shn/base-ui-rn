import * as React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react-native';

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
 * Helper for firing keyboard events
 */
export function fireKeyPress(
  element: ReturnType<RenderResult['getByRole']>,
  key: string,
): void {
  fireEvent(element, 'keyPress', { nativeEvent: { key } });
}

/**
 * Helper for firing accessibility actions
 */
export function fireAccessibilityAction(
  element: ReturnType<RenderResult['getByRole']>,
  actionName: string,
): void {
  fireEvent(element, 'accessibilityAction', {
    nativeEvent: { actionName },
  });
}

/**
 * Helper for testing multiple keys at once
 */
export function fireMultipleKeyPresses(
  element: ReturnType<RenderResult['getByRole']>,
  keys: string[],
): void {
  keys.forEach((key) => fireKeyPress(element, key));
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
