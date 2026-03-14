import type {
  ViewProps,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import type {
  KeyPressEventData,
  WebAccessibilityProps,
} from '@base-ui-rn/core';

export type Orientation = 'horizontal' | 'vertical';
export type ThumbCollisionBehavior = 'push' | 'swap' | 'none';
export type ThumbAlignment = 'center' | 'edge';

export interface SliderState {
  /**
   * The current values of the slider.
   */
  values: number[];
  /**
   * The current values mapped to percentages (0-100).
   */
  percentages: number[];
  /**
   * The index of the thumb currently being dragged, or -1.
   */
  draggingIndex: number;
  /**
   * The index of the thumb currently focused, or -1.
   */
  focusedIndex: number;
  /**
   * The layout orientation of the slider.
   */
  orientation: Orientation;
  /**
   * Whether the slider is disabled.
   */
  disabled: boolean;
  /**
   * The minimum allowed value.
   */
  min: number;
  /**
   * The maximum allowed value.
   */
  max: number;
  /**
   * ID for the associated label.
   */
  labelId: string;
}

export interface SliderRootProps
  extends Omit<ViewProps, 'children'>, WebAccessibilityProps {
  /**
   * The content of the slider.
   */
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
  /**
   * The controlled value of the slider.
   * For range sliders, provide an array of numbers.
   */
  value?: number | number[];
  /**
   * The uncontrolled default value of the slider.
   */
  defaultValue?: number | number[];
  /**
   * Callback fired when the slider's value changes.
   */
  onValueChange?: (value: number | number[]) => void;
  /**
   * Callback fired when the user finishes interacting with the slider.
   */
  onValueCommitted?: (value: number | number[]) => void;
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
   * The granularity for large steps (e.g. Page Up/Down).
   * @default 10
   */
  largeStep?: number;
  /**
   * The layout orientation of the slider.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * Controls how thumbs behave when they collide.
   * @default 'push'
   */
  thumbCollisionBehavior?: ThumbCollisionBehavior;
  /**
   * How the thumb(s) are aligned relative to the control edges.
   * @default 'center'
   */
  thumbAlignment?: ThumbAlignment;
  /**
   * Whether the slider is disabled.
   * @default false
   */
  disabled?: boolean;
}

export interface SliderLabelProps
  extends Omit<ViewProps, 'children'>, WebAccessibilityProps {
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
}

export interface SliderValueProps extends Omit<ViewProps, 'children'> {
  /**
   * Render function for formatting values.
   */
  children?: (formattedValues: string[], values: number[]) => React.ReactNode;
  /**
   * Options for value formatting.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * Locale used for formatting.
   */
  locale?: string;
}

export interface SliderControlProps extends Omit<ViewProps, 'children'> {
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
}

export interface SliderTrackProps extends Omit<ViewProps, 'children'> {
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
}

export interface SliderIndicatorProps extends Omit<ViewProps, 'children'> {
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
}

export interface SliderThumbProps
  extends Omit<ViewProps, 'children'>, WebAccessibilityProps {
  children?:
    | React.ReactNode
    | ((state: SliderState & { index: number }) => React.ReactNode);
  /**
   * The index of the thumb in a range slider.
   */
  index?: number;
  /**
   * Callback fired when the thumb receives focus.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Callback fired when the thumb loses focus.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
}

export type { KeyPressEventData, WebAccessibilityProps };
