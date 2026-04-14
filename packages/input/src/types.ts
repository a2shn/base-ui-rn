import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputChangeEventData,
  TextInputProps,
  ViewStyle,
} from 'react-native';

export interface InputChangeEventDetails {
  nativeEvent: NativeSyntheticEvent<TextInputChangeEventData>;
}

export interface InputState extends FocusRingState {
  disabled: boolean;
  readOnly: boolean;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  invalid: boolean;
  filled: boolean;
}

export interface InputProps extends Omit<
  TextInputProps,
  'style' | 'readOnly' | 'editable'
> {
  /**
   * Style applied to the input component. Accepts a standard style object
   * or a function that receives the current InputState.
   */
  style?: StyleProp<ViewStyle> | ((state: InputState) => StyleProp<ViewStyle>);
  /**
   * The controlled value of the input. Use with `onValueChange`.
   */
  value?: string;
  /**
   * The initial value of the input when uncontrolled.
   */
  defaultValue?: string;
  /**
   * Fired when the value changes.
   */
  onValueChange?: (value: string, details: InputChangeEventDetails) => void;
  /**
   * Fired when the input's dirty state changes.
   */
  onDirtyChange?: (dirty: boolean) => void;
  /**
   * Fired when the input's touched state changes.
   */
  onTouchedChange?: (touched: boolean) => void;
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input is read-only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
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
   * Whether the input has been interacted with.
   */
  touched?: boolean;
  /**
   * Disable the default focus ring styling provided by the focus-ring package.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the input remains focusable even when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}
