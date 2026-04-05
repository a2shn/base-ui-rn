import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type {
  NativeSyntheticEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type { KeyDownEventData } from '@base-ui-rn/core';

/**
 * The value type for a radio button.
 */
export type RadioValue = string;

/**
 * State of the RadioGroup root.
 */
export interface RadioGroupState {
  /**
   * Whether the group is disabled.
   */
  disabled: boolean;
  /**
   * The currently selected value.
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
    event: NativeSyntheticEvent<KeyDownEventData>,
  ) => void;
  /**
   * Whether the group is read-only.
   */
  readOnly: boolean;
}

/**
 * Props for the RadioGroup component.
 */
export interface RadioGroupProps extends Omit<ViewProps, 'style' | 'children'> {
  /**
   * The content of the radio group.
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
   */
  defaultValue?: RadioValue;

  /**
   * The controlled value of the selected radio.
   */
  value?: RadioValue;

  /**
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: RadioValue) => void;

  /**
   * Whether the group is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the group is read-only.
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
 * Props for the Radio.Root component.
 */
export interface RadioRootProps extends Omit<
  React.ComponentProps<typeof PressableWithKeyDown>,
  'children' | 'style'
> {
  /**
   * The unique value of this radio within the group.
   */
  value: RadioValue;

  /**
   * The content of the radio root.
   */
  children?: React.ReactNode | ((state: RadioRootState) => React.ReactNode);

  /**
   * Style applied to the radio root view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: RadioRootState) => StyleProp<ViewStyle>);

  /**
   * Whether the radio is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the radio is read-only.
   * @default false
   */
  readOnly?: boolean;

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
 * Props for the Radio.Indicator component.
 */
export interface RadioIndicatorProps extends Omit<
  ViewProps,
  'style' | 'children'
> {
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
   * Whether to keep the indicator in the tree when unchecked.
   * @default false
   */
  keepMounted?: boolean;
}
