import { type PressableProps, type NativeSyntheticEvent } from 'react-native';

export type WebAccessibilityProps = {
  tabIndex?: 0 | -1;
  'aria-disabled'?: boolean;
};

export type KeyPressEventData = {
  key: string;
};

/**
 * Details passed as the second argument to `onPressedChange`.
 * Describes how the button was activated.
 */
export interface ButtonPressedChangeDetails {
  /**
   * How the button was activated.
   *
   * - `'press'`               — touch or mouse press
   * - `'keyboard'`            — hardware keyboard key (Enter / Space / Select / OK …)
   * - `'accessibilityAction'` — screen reader action (activate / click / magicTap)
   */
  source: 'press' | 'keyboard' | 'accessibilityAction';
}

export interface ButtonProps extends PressableProps {
  /**
   * Disables press, focus, and keyboard interaction.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Keeps the button focusable even when disabled.
   *
   * Useful for loading states where focus should not be lost.
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Describes the result of activating the button.
   *
   * @default 'Activates the button'
   */
  accessibilityHint?: string;

  /**
   * Called when the button is activated.
   *
   * @param details  Source details describing how the button was activated.
   */
  onPressedChange?: (details: ButtonPressedChangeDetails) => void;

  /**
   * Called when a hardware keyboard key is pressed while the button is focused.
   *
   * Useful for Web and TV platforms where keyboard interaction is expected.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Expands the interactive touch area beyond the visual bounds.
   *
   * @default
   * { top: 10, bottom: 10, left: 10, right: 10 }
   */
  hitSlop?: PressableProps['hitSlop'];
}
