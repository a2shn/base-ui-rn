import type {
  ARIABaseProps,
  ARIALiveProps,
  ARIATraitChecked,
  ARIATraitDisabled,
  KeyPressEventData,
} from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * The value type for a radio button / group.
 */
export type RadioValue = string;

/**
 * State exposed by the RadioGroup.
 */
export interface RadioGroupState {
  /**
   * Whether the group is disabled.
   */
  disabled: boolean;
  /**
   * Whether all radios in the group are read-only.
   */
  readOnly: boolean;
  /**
   * The currently selected value, or `undefined` when nothing is selected.
   */
  value: RadioValue | undefined;
}

/**
 * Context value provided by RadioGroup to its Radio.Root children.
 */
export interface RadioGroupContextValue extends RadioGroupState {
  /**
   * Selects a new value in the group.
   */
  onValueChange: (value: RadioValue) => void;
  /**
   * Registers a radio item ref for keyboard navigation.
   */
  registerItem: (
    value: RadioValue,
    ref: React.RefObject<unknown>,
  ) => () => void;
  /**
   * Handles arrow-key navigation initiated by a radio item.
   */
  onRadioKeyDown: (
    currentValue: RadioValue,
    event: NativeSyntheticEvent<KeyPressEventData>,
  ) => void;
}

/**
 * Web-specific accessibility props for RadioGroup.
 */
export type WebRadioGroupAccessibilityProps = ARIABaseProps &
  ARIALiveProps &
  ARIATraitDisabled & {
    /**
     * Custom data attribute. Present when the group is disabled.
     */
    'data-disabled'?: 'true' | boolean;
  };

export interface RadioGroupProps
  extends
    Omit<ViewProps, 'style' | 'children'>,
    WebRadioGroupAccessibilityProps {
  /**
   * The content of the radio group (one or more Radio.Root elements).
   */
  children?: React.ReactNode | ((state: RadioGroupState) => React.ReactNode);

  /**
   * Style applied to the group container.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: RadioGroupState) => StyleProp<ViewStyle>);

  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;

  /**
   * The uncontrolled default value of the selected radio.
   * Use `value` for a controlled radio group.
   */
  defaultValue?: RadioValue;

  /**
   * The controlled value of the selected radio.
   * Use `defaultValue` for an uncontrolled radio group.
   */
  value?: RadioValue;

  /**
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: RadioValue) => void;

  /**
   * Whether the group should ignore user interaction.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the user should be unable to select a different radio in the group.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether to loop keyboard focus when reaching the first or last item.
   * @default true
   */
  loopFocus?: boolean;

  /**
   * The orientation used for arrow-key navigation.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * State of a single Radio.Root.
 */
export interface RadioRootState extends FocusRingState {
  /**
   * Whether the radio is currently checked.
   */
  checked: boolean;
  /**
   * Whether the radio is disabled.
   */
  disabled: boolean;
  /**
   * Whether the radio is read-only.
   */
  readOnly: boolean;
}

/**
 * Web-specific accessibility props for Radio.Root.
 */
export type WebRadioRootAccessibilityProps = ARIABaseProps &
  ARIATraitDisabled &
  ARIATraitChecked & {
    /**
     * Present when the radio is checked.
     */
    'data-checked'?: 'true';
    /**
     * Present when the radio is not checked.
     */
    'data-unchecked'?: 'true';
    /**
     * Present when the radio is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * Present when the radio is read-only.
     */
    'data-readonly'?: 'true';
  };

export interface RadioRootProps
  extends
    Omit<PressableProps, 'role' | 'children' | 'style' | 'aria-checked'>,
    WebRadioRootAccessibilityProps {
  /**
   * The unique identifying value of this radio within the group.
   */
  value: RadioValue;

  /**
   * The content of the radio root (typically Radio.Indicator).
   */
  children?: React.ReactNode | ((state: RadioRootState) => React.ReactNode);

  /**
   * Style applied to the radio root view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: RadioRootState) => StyleProp<ViewStyle>);

  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the user should be unable to select this radio button.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Callback fired when a key is pressed down.
   */
  onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Whether the radio remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

/**
 * State of a Radio.Indicator.
 */
export type RadioIndicatorState = RadioRootState;

/**
 * Web-specific accessibility props for Radio.Indicator.
 */
export type WebRadioIndicatorAccessibilityProps = ARIABaseProps &
  ARIALiveProps & {
    /**
     * Present when the radio is checked.
     */
    'data-checked'?: 'true';
    /**
     * Present when the radio is not checked.
     */
    'data-unchecked'?: 'true';
    /**
     * Present when the radio is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * Present when the radio is read-only.
     */
    'data-readonly'?: 'true';
  };

export interface RadioIndicatorProps
  extends
    Omit<ViewProps, 'style' | 'children'>,
    WebRadioIndicatorAccessibilityProps {
  /**
   * The content of the indicator.
   */
  children?:
    | React.ReactNode
    | ((state: RadioIndicatorState) => React.ReactNode);

  /**
   * Style applied to the indicator view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: RadioIndicatorState) => StyleProp<ViewStyle>);

  /**
   * Whether to keep the indicator in the tree when the radio is unchecked.
   * @default false
   */
  keepMounted?: boolean;
}

export type { KeyPressEventData };
