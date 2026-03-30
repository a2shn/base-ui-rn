import { KeyPressEventData } from '@base-ui-rn/core';
import { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface ToggleState extends FocusRingState {
  /**
   * Whether the toggle is currently pressed.
   */
  pressed: boolean;

  /**
     * Whether the toggle is disabled.
     */
  disabled: boolean;

}

export interface ToggleProps
  extends Omit<
    PressableProps,
    'children' | 'style' | 'onPress' | 'disabled' | 'role'
  > {
  /**
   * The content of the toggle.
   */
  children?: React.ReactNode | ((state: ToggleState) => React.ReactNode);

  /**
   * Style applied to the toggle view.
   */
  style?: StyleProp<ViewStyle> | ((state: ToggleState) => StyleProp<ViewStyle>);

  /**
   * A unique value for the toggle. Used within a `ToggleGroup`.
   */
  value?: string;

  /**
   * The controlled pressed state of the toggle.
   */
  pressed?: boolean;

  /**
   * The initial pressed state when uncontrolled.
   * @default false
   */
  defaultPressed?: boolean;

  /**
   * Callback fired when the pressed state changes.
   */
  onPressedChange?: (
    pressed: boolean,
  ) => void;

  /**
   * Whether the toggle remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Whether the toggle is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Callback fired when the toggle is pressed.
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * Handler for key down events.
   */
  onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
}
