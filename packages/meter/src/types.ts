import type * as React from 'react';
import type {
  StyleProp,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * Represents the current visual and semantic state of the meter.
 */
export interface MeterState {
  /** The current value of the meter. */
  value: number;
  /** The minimum value of the meter. */
  min: number;
  /** The maximum value of the meter. */
  max: number;
  /** * The upper bound of the "low" range.
   * Values below this are considered sub-optimal in the lower direction.
   */
  low: number;
  /** * The lower bound of the "high" range.
   * Values above this are considered sub-optimal in the upper direction.
   */
  high: number;
  /** * The ideal or "perfect" value for this meter.
   * Used to determine which segment is considered the "optimum" range.
   */
  optimum: number;
  /** The percentage of completion (0-100) based on min and max. */
  percentage: number;
  /** The human-readable value string, localized and formatted. */
  formattedValue: string;
  /** * The semantic status of the current value.
   * - 'low': value is less than `low`.
   * - 'high': value is greater than `high`.
   * - 'optimum': value is between `low` and `high`.
   */
  status: 'low' | 'high' | 'optimum';
}
export interface MeterRootProps extends Omit<ViewProps, 'children' | 'style'> {
  /**
   * The current value of the meter.
   */
  value: number;
  /**
   * The minimum value of the meter.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the meter.
   * @default 100
   */
  max?: number;
  /**
   * The upper bound of the "low" range.
   * Must be greater than or equal to `min`.
   * @default min
   */
  low?: number;
  /**
   * The lower bound of the "high" range.
   * Must be less than or equal to `max` and greater than or equal to `low`.
   * @default max
   */
  high?: number;
  /**
   * The point that represents the ideal value.
   * @default (min + max) / 2
   */
  optimum?: number;
  /**
   * A function to generate a human-readable representation of the value for screen readers.
   */
  getAccessibilityValueText?: (formattedValue: string, value: number) => string;
  /**
   * The locale to use for formatting the value.
   */
  locale?: string;
  /**
   * The options to use for formatting the value.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * Style of the root component. Can be a standard style object or a function
   * that receives the current `MeterState`.
   */
  style?: StyleProp<ViewStyle> | ((state: MeterState) => StyleProp<ViewStyle>);
  /**
   * Children of the root component. Can be a React node or a render function
   * that receives the current `MeterState`.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  defaultValue?: number;
}
export interface MeterLabelProps extends Omit<TextProps, 'children' | 'style'> {
  /**
   * Children of the label component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  /**
   * Style of the label component.
   */
  style?: StyleProp<TextStyle> | ((state: MeterState) => StyleProp<TextStyle>);
}

export interface MeterTrackProps extends Omit<ViewProps, 'children' | 'style'> {
  /**
   * Children of the track component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  /**
   * Style of the track component.
   */
  style?: StyleProp<ViewStyle> | ((state: MeterState) => StyleProp<ViewStyle>);
}

export interface MeterIndicatorProps extends Omit<ViewProps, 'style'> {
  /**
   * Style of the indicator component.
   */
  style?: StyleProp<ViewStyle> | ((state: MeterState) => StyleProp<ViewStyle>);
}

export interface MeterValueProps extends Omit<TextProps, 'children' | 'style'> {
  /**
   * Children of the value component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  /**
   * Style of the value component.
   */
  style?: StyleProp<TextStyle> | ((state: MeterState) => StyleProp<TextStyle>);
}

/**
 * The context value for the Meter component.
 */
export interface MeterContextValue extends MeterState {

}
