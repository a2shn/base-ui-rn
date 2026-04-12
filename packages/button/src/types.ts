import { PressableWithKeyDown } from '@base-ui-rn/core';
import { FocusRingState } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface ButtonState extends FocusRingState {
  pressed: boolean;
  disabled: boolean;
}

export interface ButtonProps extends Omit<React.ComponentProps<typeof PressableWithKeyDown>, 'children' | 'style'> {
  /**
   * The content of the button.
   * Can be a React node or a render function receiving the current button state.
   */
  children?: React.ReactNode | ((state: ButtonState) => React.ReactNode);
  /**
   * Style applied to the button.
   * Can be a static style or a function based on the button state.
   */
  style?: StyleProp<ViewStyle> | ((state: ButtonState) => StyleProp<ViewStyle>);
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the button remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * Disables the default focus ring behavior.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * The controlled pressed state of the button. Use with `onPressedChange`.
   */
  pressed?: boolean;
  /**
   * The initial pressed state of the button when uncontrolled.
   * @default false
   */
  defaultPressed?: boolean;
  /**
   * Fired when the pressed state changes.
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * The tabIndex of the button.
   */
  tabIndex?: 0 | -1;
}
