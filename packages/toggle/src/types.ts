import type { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ToggleState extends FocusRingState {
  pressed: boolean;
  disabled: boolean;
}

export interface ToggleProps extends Omit<React.ComponentProps<typeof PressableWithKeyDown>, 'children' | 'style'> {
  /**
   * The role of the toggle.
   * @default 'checkbox'
   */
  role?: 'checkbox' | 'switch';
  /**
   * The content of the toggle.
   */
  children?: React.ReactNode | ((state: ToggleState) => React.ReactNode);
  /**
   * Style applied to the toggle view.
   */
  style?: StyleProp<ViewStyle> | ((state: ToggleState) => StyleProp<ViewStyle>);
  /**
   * A unique value for the toggle. Used within a ToggleGroup.
   */
  value?: string;
  /**
   * The controlled pressed state of the toggle. Use with `onPressedChange`.
   */
  pressed?: boolean;
  /**
   * The initial pressed state when uncontrolled.
   * @default false
   */
  defaultPressed?: boolean;
  /**
   * Fired when the pressed state changes.
   */
  onPressedChange?: (pressed: boolean) => void;
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
}
