import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  ARIATraitRange,
} from '@base-ui-rn/core';
import type * as React from 'react';
import type { TextProps, ViewProps } from 'react-native';

/**
 * Web-specific accessibility props for the Meter component.
 */
export type WebMeterAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitRange;

/**
 * Props for the Meter.Root component.
 */
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
   * A string representation of the current value for screen readers.
   */
  'aria-valuetext'?: string;
  /**
   * A function to generate a string representation of the current value for screen readers.
   */
  getAriaValueText?: (value: number, min: number, max: number) => string;
  /**
   * The locale to use for formatting the value.
   */
  locale?: string;
  /**
   * The options to use for formatting the value.
   */
  format?: Intl.NumberFormatOptions;
}

/**
 * Props for the Meter.Label component.
 */
export interface MeterLabelProps
  extends TextProps, ARIABaseProps, ARIAFocusProps, ARIALiveProps {
  /**
   * The content of the label.
   */
  children?: React.ReactNode;
}

/**
 * Props for the Meter.Track component.
 */
export interface MeterTrackProps
  extends ViewProps, ARIABaseProps, ARIAFocusProps, ARIALiveProps {
  /**
   * The content of the track.
   */
  children?: React.ReactNode;
}

/**
 * Props for the Meter.Indicator component.
 */
export interface MeterIndicatorProps
  extends ViewProps, ARIABaseProps, ARIAFocusProps, ARIALiveProps {}

/**
 * Props for the Meter.Value component.
 */
export interface MeterValueProps
  extends
    Omit<TextProps, 'children'>,
    ARIABaseProps,
    ARIAFocusProps,
    ARIALiveProps {
  /**
   * The content of the value component.
   */
  children?: (formattedValue: string, value: number) => React.ReactNode;
}

/**
 * The context value for the Meter component.
 */
export interface MeterContextValue {
  /**
   * The current value of the meter.
   */
  value: number;
  /**
   * The minimum value of the meter.
   */
  min: number;
  /**
   * The maximum value of the meter.
   */
  max: number;
  /**
   * The percentage of completion.
   */
  percentage: number;
  /**
   * The formatted value string.
   */
  formattedValue: string;
  /**
   * The accessible text for the current value.
   */
  ariaValueText?: string;
  /**
   * The ID of the label element.
   */
  labelId?: string;
}

export interface MeterTrackProps
  extends ViewProps, ARIABaseProps, ARIAFocusProps, ARIALiveProps {
  children?: React.ReactNode;
}

export interface MeterIndicatorProps
  extends ViewProps, ARIABaseProps, ARIAFocusProps, ARIALiveProps {}

export interface MeterValueProps
  extends
    Omit<TextProps, 'children'>,
    ARIABaseProps,
    ARIAFocusProps,
    ARIALiveProps {
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
