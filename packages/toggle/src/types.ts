import type {
  PressableProps,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  type PressedChangeDetails,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import type { ShortcutConfig } from '@base-ui-rn/keyboard-shortcuts';

/**
 * Details passed as the second argument to `onPressedChange`.
 * Describes how the toggle was activated.
 */
export type TogglePressedChangeDetails = PressedChangeDetails;

export interface ToggleState {
  /**
   * Whether the toggle is currently pressed.
   */
  pressed: boolean;
  /**
   * Whether the toggle is currently focused.
   */
  focused: boolean;
  /**
   * Whether the toggle should show a focus ring.
   */
  focusVisible: boolean;
}

export interface ToggleProps extends Omit<
  PressableProps,
  'role' | 'children' | 'style'
> {
  /**
   * The child elements or a render function.
   */
  children?: React.ReactNode | ((state: ToggleState) => React.ReactNode);

  /**
   * The style of the toggle or a function that returns a style based on state.
   */
  style?: StyleProp<ViewStyle> | ((state: ToggleState) => StyleProp<ViewStyle>);

  /**
   * The value of the toggle.
   * Used when the toggle is part of a `ToggleGroup`.
   */
  value?: string;

  /**
   * Controlled pressed state.
   */
  pressed?: boolean;

  /**
   * Uncontrolled initial pressed state.
   *
   * @default false
   */
  defaultPressed?: boolean;

  /**
   * Called when the pressed state changes.
   *
   * @param pressed  The next pressed state.
   * @param details  Source details describing how the toggle was activated.
   */
  onPressedChange?: (
    pressed: boolean,
    details: TogglePressedChangeDetails,
  ) => void;

  /**
   * Accessibility role exposed to assistive technologies.
   *
   * @default 'checkbox'
   */
  role?: 'checkbox' | 'switch';

  /**
   * Describes the result of toggling the control.
   *
   * @default 'Toggles the state'
   */
  accessibilityHint?: string;

  /**
   * Keeps the toggle focusable even when disabled.
   *
   * Useful for loading states where focus should not jump away.
   * The toggle remains in the tab/focus order and screen readers can still
   * announce it as disabled, but all activation is blocked.
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Whether the focus ring should be visible even during touch interactions.
   * @default false
   */
  focusVisible?: boolean;

  /**
   * Whether to disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Called when a hardware keyboard key is pressed while the toggle is focused.
   *
   * Fired for every key — including non-activation keys — so you can handle
   * custom navigation or analytics. Activation keys that change pressed state
   * are processed before this callback fires.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Keyboard shortcut for the toggle.
   */
  shortcut?: ShortcutConfig;

  /**
   * Expands the interactive touch area beyond the visual bounds.
   *
   * @default
   * { top: 14, bottom: 14, left: 14, right: 14 }
   */
  hitSlop?: PressableProps['hitSlop'];
}

// Re-export commonly used types from core
export type {
  KeyPressEventData,
  WebToggleAccessibilityProps,
} from '@base-ui-rn/core';
