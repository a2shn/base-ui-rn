import type * as React from 'react';
import type { ViewProps, TextProps } from 'react-native';
import type { WebAccessibilityProps } from '@base-ui-rn/core';

export interface MeterRootProps extends ViewProps, WebAccessibilityProps {
  /**
   * The current value.
   */
  value: number;
  /**
   * The minimum value.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value.
   * @default 100
   */
  max?: number;
  /**
   * A string value that provides a user-friendly name for aria-valuenow.
   */
  'aria-valuetext'?: string;
  /**
   * A function that returns a string value that provides a human-readable text alternative for aria-valuenow.
   */
  getAriaValueText?: (value: number, min: number, max: number) => string;
  /**
   * The locale used by Intl.NumberFormat when formatting the value.
   * Defaults to the user's runtime locale.
   */
  locale?: string;
  /**
   * Options to format the value.
   */
  format?: Intl.NumberFormatOptions;
}

export interface MeterLabelProps extends TextProps, WebAccessibilityProps {}

export interface MeterTrackProps extends ViewProps, WebAccessibilityProps {}

export interface MeterIndicatorProps extends ViewProps, WebAccessibilityProps {}

export interface MeterValueProps
  extends Omit<TextProps, 'children'>, WebAccessibilityProps {
  /**
   * A function that returns a ReactNode based on the formatted value and current value.
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
