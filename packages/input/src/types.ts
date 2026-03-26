import type {
  ARIABaseProps,
  ARIAFocusProps,
  ARIATraitDisabled,
} from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputProps,
  ViewStyle,
} from 'react-native';

/**
 * Details passed to the `onValueChange` callback.
 */
export interface InputChangeEventDetails {
  /**
   * The native event from the text input.
   */
  nativeEvent: NativeSyntheticEvent<unknown>;
}

/**
 * The current state of the Input component.
 */
export interface InputState extends FocusRingState {
  /**
   * Whether the input is disabled.
   */
  disabled: boolean;
  /**
   * Whether the input has been "touched" or interacted with.
   */
  touched: boolean;
  /**
   * Whether the input's value has been modified.
   */
  dirty: boolean;
  /**
   * Whether the input is in a valid state.
   */
  valid: boolean;
  /**
   * Whether the input is in an invalid state.
   */
  invalid: boolean;
  /**
   * Whether the input has a value (is not empty).
   */
  filled: boolean;
}

/**
 * Props for the Input component.
 */
export interface InputProps
  extends
    Omit<TextInputProps, 'style'>,
    ARIABaseProps,
    ARIAFocusProps,
    ARIATraitDisabled {
  /**
   * Style applied to the input component.
   */
  style?: StyleProp<ViewStyle> | ((state: InputState) => StyleProp<ViewStyle>);
  /**
   * The controlled value of the input.
   */
  value?: string;
  /**
   * The default value of the input when uncontrolled.
   */
  defaultValue?: string;
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string, details: InputChangeEventDetails) => void;
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input is in a valid state.
   */
  valid?: boolean;
  /**
   * Whether the input is in an invalid state.
   */
  invalid?: boolean;
  /**
   * Whether the input's value has been modified.
   */
  dirty?: boolean;
  /**
   * Whether the input has been "touched" or interacted with.
   */
  touched?: boolean;

  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the input remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}
