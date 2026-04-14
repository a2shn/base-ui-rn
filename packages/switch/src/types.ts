import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface SwitchState extends FocusRingState {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
}

export interface SwitchRootProps extends Omit<
  React.ComponentProps<typeof PressableWithKeyDown>,
  'children' | 'style'
> {
  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;
  /**
   * The value submitted with the form when the switch is on.
   */
  value?: string;
  /**
   * The value submitted with the form when the switch is off.
   */
  uncheckedValue?: string;
  /**
   * The content of the switch root.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);
  /**
   * Style applied to the switch view.
   */
  style?: StyleProp<ViewStyle> | ((state: SwitchState) => StyleProp<ViewStyle>);
  /**
   * The controlled checked state of the switch. Use with `onCheckedChange`.
   */
  checked?: boolean;
  /**
   * The initial checked state when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Whether the switch is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the switch is read-only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the switch remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

export interface SwitchThumbProps extends Omit<
  ViewProps,
  'style' | 'children'
> {
  /**
   * The content of the thumb.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);
  /**
   * Style applied to the thumb view.
   */
  style?: StyleProp<ViewStyle> | ((state: SwitchState) => StyleProp<ViewStyle>);
}
