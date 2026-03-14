import type {
  PressableProps,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
  ViewProps,
} from 'react-native';
import type {
  KeyPressEventData,
  WebAccessibilityProps,
} from '@base-ui-rn/core';

export interface SwitchState {
  /**
   * Whether the switch is currently checked.
   */
  checked: boolean;
  /**
   * Whether the switch is disabled.
   */
  disabled: boolean;
  /**
   * Whether the switch is read-only.
   */
  readOnly: boolean;
  /**
   * Whether the switch is currently focused.
   */
  focused: boolean;
  /**
   * Whether the switch should show a focus ring.
   */
  focusVisible: boolean;
}

export interface SwitchRootProps
  extends Omit<PressableProps, 'children' | 'style'>, WebAccessibilityProps {
  /**
   * The content of the switch root.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);

  /**
   * Style applied to the switch view.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * The controlled checked state of the switch.
   */
  checked?: boolean;

  /**
   * The initial checked state when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the checked state changes.
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
   * Whether to force the focus-visible state.
   * @default false
   */
  focusVisible?: boolean;

  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Callback fired when a key is pressed.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  'data-checked'?: string;
  'data-disabled'?: string;
}

export interface SwitchThumbProps
  extends Omit<ViewProps, 'children' | 'style'>, WebAccessibilityProps {
  /**
   * The content of the thumb.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);

  /**
   * Style applied to the thumb view.
   */
  style?: StyleProp<ViewStyle>;

  'data-checked'?: string;
  'data-disabled'?: string;
}

export type { KeyPressEventData, WebAccessibilityProps };
