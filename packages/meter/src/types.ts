import type * as React from 'react';
import type {
  StyleProp,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * Represents the state of the meter.
 */
export interface MeterState {
  /** The current value of the meter. */
  value: number;
  /** The minimum value of the meter. */
  min: number;
  /** The maximum value of the meter. */
  max: number;
  /** The percentage of completion (0-100). */
  percentage: number;
  /** The human-readable value string. */
  formattedValue: string;
  /** Whether the meter is at its maximum value. */
  isComplete: boolean;
}

export interface MeterRootProps
  extends Omit<ViewProps, 'children' | 'style'> {
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
   * A function to generate a human-readable representation of the value for screen readers.
   */
  getAccessibilityValueText?: (
    formattedValue: string,
    value: number,
  ) => string;
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
  style?:
    | StyleProp<ViewStyle>
    | ((state: MeterState) => StyleProp<ViewStyle>);
  /**
   * Children of the root component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
}

export interface MeterLabelProps
  extends Omit<TextProps, 'children' | 'style'> {
  /**
   * Children of the label component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  /**
   * Style of the label component.
   */
  style?:
    | StyleProp<TextStyle>
    | ((state: MeterState) => StyleProp<TextStyle>);
}

export interface MeterTrackProps
  extends Omit<ViewProps, 'children' | 'style'> {
  /**
   * Children of the track component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  /**
   * Style of the track component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: MeterState) => StyleProp<ViewStyle>);
}

export interface MeterIndicatorProps extends Omit<ViewProps, 'style'> {
  /**
   * Style of the indicator component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: MeterState) => StyleProp<ViewStyle>);
}

export interface MeterValueProps
  extends Omit<TextProps, 'children' | 'style'> {
  /**
   * Children of the value component.
   */
  children?: React.ReactNode | ((state: MeterState) => React.ReactNode);
  /**
   * Style of the value component.
   */
  style?:
    | StyleProp<TextStyle>
    | ((state: MeterState) => StyleProp<TextStyle>);
}

/**
 * The context value for the Meter component.
 */
export interface MeterContextValue extends MeterState {
  /**
   * The ID of the label element.
   */
  labelId: string;
}
