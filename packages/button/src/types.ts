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

/**
 * Details passed to `onPressedChange` callback.
 * Describes how the button was activated.
 */
export type ButtonPressedChangeDetails = PressedChangeDetails;

export interface ButtonState {
  /**
   * Whether the button is currently pressed.
   */
  pressed: boolean;
  /**
   * Whether the button is currently focused.
   */
  focused: boolean;
  /**
   * Whether the button should show a focus ring.
   */
  focusVisible: boolean;
}

export interface ButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  /**
   * The child elements or a render function.
   */
  children?: React.ReactNode | ((state: ButtonState) => React.ReactNode);

  /**
   * The style of the button or a function that returns a style based on state.
   */
  style?: StyleProp<ViewStyle> | ((state: ButtonState) => StyleProp<ViewStyle>);

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
