import { type PressableProps, type NativeSyntheticEvent } from 'react-native';

export type KeyPressEventData = { key: string };

export type WebToggleProps = {
  tabIndex?: 0 | -1;
  'aria-disabled'?: boolean;
  /**
   * Reflects pressed state for the ARIA button-toggle pattern on web.
   * Automatically set when the toggle uses role="button".
   */
  'aria-pressed'?: boolean;
  /**
   * Custom data attribute applied on web for CSS selectors and testing.
   * Reflects the current pressed state as a boolean string.
   *
   * @example
   * [data-pressed="true"] { background: blue; }
   */
  'data-pressed'?: boolean;
};

/**
 * Details passed as the second argument to `onPressedChange`.
 * Describes how the toggle was activated.
 */
export interface TogglePressedChangeDetails {
  /**
   * How the toggle was activated.
   *
   * - `'press'`               — touch or mouse press
   * - `'keyboard'`            — hardware keyboard key (Enter / Space / Select / OK …)
   * - `'accessibilityAction'` — screen reader action (activate / click / magicTap)
   */
  source: 'press' | 'keyboard' | 'accessibilityAction';
}

export interface ToggleProps extends Omit<PressableProps, 'role'> {
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
   * Called when a hardware keyboard key is pressed while the toggle is focused.
   *
   * Fired for every key — including non-activation keys — so you can handle
   * custom navigation or analytics. Activation keys that change pressed state
   * are processed before this callback fires.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Expands the interactive touch area beyond the visual bounds.
   *
   * @default
   * { top: 14, bottom: 14, left: 14, right: 14 }
   */
  hitSlop?: PressableProps['hitSlop'];
}
