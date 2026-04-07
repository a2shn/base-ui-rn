import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type {
  TextProps,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * The value of the slider.
 */
export type SliderValue = number | number[];

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

export interface SliderIndicatorProps extends Omit<ViewProps, 'style'> {
  /**
   * Style applied to the indicator view.
   */
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
}

/**
 * Props for the Slider.Root component.
 */
export interface SliderRootProps
  extends Omit<ViewProps, 'style' | 'children'> {
  /**
   * Style applied to the slider root view.
   */
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
  /**
   * The content of the slider root.
   */
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
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
  ) => void;
  /**
   * Whether the slider is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The minimum value of the slider.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the slider.
   * @default 100
   */
  max?: number;
  /**
   * The step value of the slider.
   * @default 1
   */
  step?: number;
  /**
   * The number of steps between thumbs.
   * @default 0
   */
  minStepsBetweenValues?: number;
  /**
   * The maximum number of steps between thumbs.
   * @default 0
   */
  maxStepsBetweenValues?: number;
  /**
   * The fixed number of steps between thumbs.
   */
  stepBetweenValues?: number;
  /**
   * The large step value for keyboard navigation.
   * @default 10
   */
  largeStep?: number;
  /**
   * The locale to use for formatting values.
   */
  locale?: string;
  /**
   * The format options for values.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * The orientation of the slider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The alignment of the thumb.
   * @default 'center'
   */
  thumbAlignment?: 'center' | 'edge' | 'edge-client-only';
  /**
   * The collision behavior of the thumb.
   * @default 'none'
   */
  thumbCollisionBehavior?: 'none' | 'push' | 'swap';
  /**
   * Callback fired when the value is committed.
   */
  onValueCommitted?: (
    value: SliderValue,
  ) => void;
}

/**
 * Props for the Slider.Thumb component.
 */
export interface SliderThumbProps
  extends
  Omit<React.ComponentProps<typeof PressableWithKeyDown>,
    'style' | "children"> {
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
   * A function to generate a human-readable text alternative for the current value.
   */
  getAccessibilityValueText?: (
    formattedValue: string,
    value: number,
    index: number,
  ) => string;
  /**
   * Style applied to the thumb view.
   */
  style?: ViewStyle | ((state: SliderThumbState) => ViewStyle | undefined);
  /**
     * The content of the slider thumb.
     */
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);

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
 * Props for the Slider.Value component.
 */
export interface SliderValueProps
  extends Omit<TextProps, 'children'> {
  /**
   * A function that returns content based on the formatted values.
   */
  children?:
  | React.ReactNode
  | ((formattedValues: string[], values: number[]) => React.ReactNode);
}

