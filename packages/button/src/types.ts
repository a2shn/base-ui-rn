import { type PressableProps, type NativeSyntheticEvent } from 'react-native';
import {
  type PressedChangeDetails,
  type KeyPressEventData,
} from '@base-ui-rn/core';

/**
 * Details passed to `onPressedChange` callback.
 * Describes how the button was activated.
 */
export type ButtonPressedChangeDetails = PressedChangeDetails;

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

export type {
  KeyPressEventData,
  WebAccessibilityProps,
} from '@base-ui-rn/core';
