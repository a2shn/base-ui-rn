import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type { TextProps, ViewProps, ViewStyle } from 'react-native';

export type SliderValue = number | number[];

export interface SliderState {
  value: number[];
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  dragging: boolean;
  activeIndex: number | null;
  orientation: 'horizontal' | 'vertical';
  minStepsBetweenValues: number;
  maxStepsBetweenValues: number;
}

export interface SliderIndicatorProps extends Omit<ViewProps, 'style'> {
  /**
   * Style applied to the indicator view.
   */
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
}

export interface SliderRootProps extends Omit<ViewProps, 'style' | 'children'> {
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
   * The controlled value of the slider. Use with `onValueChange`.
   */
  value?: SliderValue;
  /**
   * The default value when uncontrolled.
   */
  defaultValue?: SliderValue;
  /**
   * Fired when the value changes.
   */
  onValueChange?: (value: SliderValue) => void;
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
   * Fired when the value is committed.
   */
  onValueCommitted?: (value: SliderValue) => void;
}

export interface SliderThumbProps extends Omit<
  React.ComponentProps<typeof PressableWithKeyDown>,
  'style' | 'children'
> {
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
  index: number;
  valueNow: number;
}

export interface SliderValueProps extends Omit<TextProps, 'children'> {
  /**
   * A function that returns content based on the formatted values.
   */
  children?:
    | React.ReactNode
    | ((formattedValues: string[], values: number[]) => React.ReactNode);
}
