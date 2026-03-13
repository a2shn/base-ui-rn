import type * as React from 'react';
import type { ViewProps, TextProps } from 'react-native';
import type {
  WebAccessibilityProps,
  WebMeterAccessibilityProps,
} from '@base-ui-rn/core';

export interface MeterRootProps extends ViewProps, WebMeterAccessibilityProps {
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
   * A user-friendly name for the current value.
   */
  'aria-valuetext'?: string;
  /**
   * Callback to generate a human-readable text alternative for the value.
   */
  getAriaValueText?: (value: number, min: number, max: number) => string;
  /**
   * The locale used for formatting the value.
   */
  locale?: string;
  /**
   * Options for formatting the value.
   */
  format?: Intl.NumberFormatOptions;
}

export interface MeterLabelProps extends TextProps, WebAccessibilityProps {
  /**
   * The content of the label.
   */
  children?: React.ReactNode;
}

export interface MeterTrackProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the track.
   */
  children?: React.ReactNode;
}

export interface MeterIndicatorProps extends ViewProps, WebAccessibilityProps {}

export interface MeterValueProps
  extends Omit<TextProps, 'children'>, WebAccessibilityProps {
  /**
   * A function that returns content based on the formatted value.
   */
  children?: (formattedValue: string, value: number) => React.ReactNode;
}

export interface MeterContextValue {
  value: number;
  min: number;
  max: number;
  percentage: number;
  formattedValue: string;
  ariaValueText?: string;
  labelId?: string;
}
