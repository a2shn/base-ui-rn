import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputChangeEventData,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

/**
 * Details passed to the `onValueChange` callback.
 */
export interface InputChangeEventDetails {
  /**
   * The native event from the underlying TextInput.
   */
  nativeEvent: NativeSyntheticEvent<TextInputChangeEventData>;
}

/**
 * The current state of the Input component, used for functional styling.
 */
export interface InputState extends FocusRingState {
  disabled: boolean;
  readOnly: boolean;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  invalid: boolean;
  filled: boolean;
}

/**
 * Props for the Input component.
 */
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
   * The controlled value of the input.
   */
  value?: string;

  /**
   * The initial value of the input when uncontrolled.
   */
  defaultValue?: string;

  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string, details: InputChangeEventDetails) => void;

  /**
   * Callback fired when the input's dirty state changes.
   */
  onDirtyChange?: (dirty: boolean) => void;

  /**
   * Callback fired when the input's touched state changes.
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

/**
 * Props for the Label component.
 */
export interface LabelProps extends Omit<TextProps, 'style' | 'children'> {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  nativeID: string;
}
