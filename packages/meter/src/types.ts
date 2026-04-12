import type * as React from 'react';
import type { StyleProp, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface MeterState {
  value: number;
  min: number;
  max: number;
  low: number;
  high: number;
  optimum: number;
  percentage: number;
  formattedValue: string;
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
   * @default min
   */
  low?: number;
  /**
   * The lower bound of the "high" range.
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
   * Style of the root component.
   */
  style?: StyleProp<ViewStyle> | ((state: MeterState) => StyleProp<ViewStyle>);
  /**
   * Children of the root component.
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

export interface MeterContextValue extends MeterState {}
