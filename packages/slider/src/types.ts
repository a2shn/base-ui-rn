import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitOrientation,
  type ARIATraitRange,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextProps,
  ViewProps,
  ViewStyle,
} from 'react-native';

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
     * Present while the user is dragging.
     */
    'data-dragging'?: boolean;
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
    /**
     * Present while the user is dragging.
     */
    'data-dragging'?: boolean;
    /**
     * Present when the thumb is focused.
     */
    'data-focused'?: boolean;
    /**
     * Indicates the index of the thumb in range sliders.
     */
    'data-index'?: number;
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
   * Whether the user is currently dragging a thumb.
   */
  dragging: boolean;
  /**
   * The index of the currently focused or dragged thumb.
   */
  activeIndex: number | null;
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
}

/**
 * Props for the Slider.Thumb component.
 */
export interface SliderThumbProps
  extends
    Omit<ViewProps, 'style' | 'disabled'>,
    WebSliderThumbAccessibilityProps {
  /**
   * Whether the thumb remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * Whether to disable the default focus ring.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
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
   * Callback fired on key down.
   */
  onKeyDown?: (event: NativeSyntheticEvent<KeyPressEventData>) => void;
  /**
   * Style applied to the thumb view.
   */
  style?: ViewStyle | ((state: SliderThumbState) => ViewStyle | undefined);
}

export interface SliderThumbState extends SliderState, FocusRingState {
  /**
   * The index of the thumb.
   */
  index: number;
  /**
   * The current value of this thumb.
   */
  valueNow: number;
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
   * Present while the user is dragging.
   */
  'data-dragging'?: boolean;
  /**
   * Present when the slider is disabled.
   */
  'data-disabled'?: boolean;
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
   * Present while the user is dragging.
   */
  'data-dragging'?: boolean;
  /**
   * Present when the slider is disabled.
   */
  'data-disabled'?: boolean;
  /**
   * A function that returns content based on the formatted values.
   */
  children?:
    | React.ReactNode
    | ((formattedValues: string[], values: number[]) => React.ReactNode);
}
