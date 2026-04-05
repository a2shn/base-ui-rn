import { PressableWithKeyDown } from '@base-ui-rn/core';
import { FocusRingState } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface ButtonState extends FocusRingState {
  /**
   * Whether the button is currently being pressed.
   */
  pressed: boolean;

  /**
   * Whether the button is disabled.
   */
  disabled: boolean;
}

export interface ButtonProps extends Omit<
  React.ComponentProps<typeof PressableWithKeyDown>,
  'children' | 'style'
> {
  /**
   * The content of the button.
   *
   * Can be a React node or a render function receiving the current button state.
   */
  children?: React.ReactNode | ((state: ButtonState) => React.ReactNode);

  /**
   * Style applied to the button.
   *
   * Can be a static style or a function based on the button state.
   */
  style?: StyleProp<ViewStyle> | ((state: ButtonState) => StyleProp<ViewStyle>);

  /**
   * Whether the button is disabled.
   *
   * Disabled buttons do not respond to press or keyboard events.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button remains focusable when disabled.
   *
   * Useful for accessibility when you still want screen readers
   * to reach the element.
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Disables the default focus ring behavior.
   *
   * Use this if you want to provide a custom focus indication.
   *
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * The controlled pressed state of the button.
   */
  pressed?: boolean;

  /**
   * The initial pressed state of the button when uncontrolled.
   * * @default false
   */
  defaultPressed?: boolean;

  /**
   * Callback fired when the pressed state changes.
   */
  onPressedChange?: (pressed: boolean) => void;

  /**
   * The tabIndex of the button.
   * * Use `0` to make it focusable in the tab order, or `-1` to make it
   * focusable only via programatic focus or clicks.
   */
  tabIndex?: 0 | -1;
}
