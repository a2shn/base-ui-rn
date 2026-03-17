import type * as React from 'react';
import type {
  GestureResponderEvent,
  TextProps,
  ViewProps,
  ViewStyle,
  NativeSyntheticEvent,
} from 'react-native';
import {
  type KeyPressEventData,
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitOrientation,
  type ARIATraitRange,
  type FocusVisibleProps,
} from '@base-ui-rn/core';

/**
 * Web-specific accessibility props for Slider Root.
 */
export type WebSliderRootAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the slider.
     * @default 'horizontal'
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Present when the slider is disabled.
     * @default false
     */
    'data-disabled'?: boolean;
    /**
     * The minimum number of steps between thumbs.
     * @default 0
     */
    'data-min-steps-between-values'?: number;
    /**
     * The fixed number of steps between thumbs.
     */
    'data-step-between-values'?: number;
    /**
     * The maximum number of steps between thumbs.
     * @default 0 (no maximum)
     */
    'data-max-steps-between-values'?: number;
  };

/**
 * Web-specific accessibility props for Slider Thumb.
 */
export type WebSliderThumbAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitRange &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the slider.
     * @default 'horizontal'
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Present when the slider is disabled.
     * @default false
     */
    'data-disabled'?: boolean;
  };

/**
 * The value of the slider.
 */
export type SliderValue = number | number[];

/**
 * Details of the value change event.
 */
export interface ChangeEventDetails {
  /**
   * The reason the value changed.
   */
  reason: 'input-change' | 'track-press' | 'drag' | 'keyboard' | 'none';
}

/**
 * Details of the value commit event.
 */
export interface CommitEventDetails {
  /**
   * The reason the value was committed.
   */
  reason: 'input-change' | 'track-press' | 'drag' | 'keyboard' | 'none';
}

/**
 * The state of the slider.
 */
export interface SliderState {
  /**
   * The current values of the slider thumbs.
   */
  value: number[];
  /**
   * The minimum allowed value.
   */
  min: number;
  /**
   * The maximum allowed value.
   */
  max: number;
  /**
   * The step increment.
   */
  step: number;
  /**
   * Whether the slider is disabled.
   */
  disabled: boolean;
  /**
   * The orientation of the slider.
   */
  orientation: 'horizontal' | 'vertical';
  /**
   * The minimum number of steps between thumbs.
   */
  minStepsBetweenValues: number;
  /**
   * The maximum number of steps between thumbs.
   * @default 0 (no maximum)
   */
  maxStepsBetweenValues: number;
}

/**
 * Props for the Slider.Root component.
 */
export interface SliderRootProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebSliderRootAccessibilityProps {
  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;
  /**
   * The controlled value of the slider.
   */
  value?: SliderValue;
  /**
   * The default value when uncontrolled.
   */
  defaultValue?: SliderValue;
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (
    value: SliderValue,
    eventDetails: ChangeEventDetails,
  ) => void;
  /**
   * Callback fired when the value is committed.
   */
  onValueCommitted?: (
    value: SliderValue,
    eventDetails: CommitEventDetails,
  ) => void;
  /**
   * The minimum allowed value.
   * @default 0
   */
  min?: number;
  /**
   * The maximum allowed value.
   * @default 100
   */
  max?: number;
  /**
   * The granularity with which the slider can step through values.
   * @default 1
   */
  step?: number;
  /**
   * The granularity when using Page Up/Down or Shift + Arrow keys.
   * @default 10
   */
  largeStep?: number;
  /**
   * The minimum steps between values in a range slider.
   * @default 0
   */
  minStepsBetweenValues?: number;
  /**
   * The maximum steps between values in a range slider.
   * @default 0 (no maximum)
   */
  maxStepsBetweenValues?: number;
  /**
   * The fixed number of steps between values in a range slider.
   */
  stepBetweenValues?: number;
  /**
   * The locale used for formatting.
   */
  locale?: Intl.LocalesArgument;
  /**
   * Options to format the input value.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * How the thumb(s) are aligned relative to the control.
   * @default 'center'
   */
  thumbAlignment?: 'center' | 'edge' | 'edge-client-only';
  /**
   * Controls how thumbs behave when they collide.
   * @default 'push'
   */
  thumbCollisionBehavior?: 'push' | 'swap' | 'none';
  /**
   * Whether the slider should ignore user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * The component orientation.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The content of the slider.
   */
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
  /**
   * Style applied to the root view.
   */
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
}

/**
 * Props for the Slider sub-components.
 */
export interface SliderPartProps
  extends Omit<ViewProps, 'children' | 'style'>, ARIABaseProps, ARIALiveProps {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Style applied to the component.
   */
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
}

/**
 * The state of a specific slider thumb.
 */
export interface SliderThumbState extends SliderState {
  /**
   * The index of the thumb.
   */
  index: number;
  /**
   * The current value of this thumb.
   */
  valueNow: number;
  /**
   * Whether the thumb is currently focused via keyboard.
   */
  focusVisible: boolean;
}

/**
 * Props for the Slider.Thumb component.
 */
export interface SliderThumbProps
  extends
    Omit<ViewProps, 'style' | 'disabled' | 'onKeyPress'>,
    WebSliderThumbAccessibilityProps,
    FocusVisibleProps {
  /**
   * The index of the thumb in a range slider.
   * @default 0
   */
  index?: number;
  /**
   * An accessible label for the thumb.
   */
  'aria-label'?: string;
  /**
   * An accessible hint for the thumb.
   */
  accessibilityHint?: string;
  /**
   * A function to generate an accessible label based on the thumb index.
   */
  getAriaLabel?: (index: number) => string;
  /**
   * A function to generate a human-readable text alternative for the current value.
   */
  getAriaValueText?: (
    formattedValue: string,
    value: number,
    index: number,
  ) => string;
  /**
   * Whether the thumb is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback fired on press.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Callback fired on key press.
   */
  onKeyPress?: (event: NativeSyntheticEvent<KeyPressEventData>) => void;
  /**
   * Style applied to the thumb view.
   */
  style?: ViewStyle | ((state: SliderThumbState) => ViewStyle | undefined);
}

/**
 * Web-specific accessibility props for Slider Label.
 */
export type WebSliderLabelAccessibilityProps = ARIABaseProps & ARIALiveProps;

/**
 * Web-specific accessibility props for Slider Value.
 */
export type WebSliderValueAccessibilityProps = ARIABaseProps & ARIALiveProps;

/**
 * Props for the Slider.Label component.
 */
export interface SliderLabelProps
  extends TextProps, WebSliderLabelAccessibilityProps {
  /**
   * The content of the label.
   */
  children?: React.ReactNode;
}

/**
 * Props for the Slider.Value component.
 */
export interface SliderValueProps
  extends Omit<TextProps, 'children'>, WebSliderValueAccessibilityProps {
  /**
   * A function that returns content based on the formatted values.
   */
  children?:
    | React.ReactNode
    | ((formattedValues: string[], values: number[]) => React.ReactNode);
}
