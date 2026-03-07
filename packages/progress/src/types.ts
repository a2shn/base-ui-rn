import type * as React from 'react';
import type { ViewProps, TextProps, StyleProp, ViewStyle } from 'react-native';
import type { WebProgressAccessibilityProps } from '@base-ui-rn/core';

export interface ProgressState {
  /**
   * The current value.
   */
  value: number | null;
  /**
   * The minimum value.
   */
  min: number;
  /**
   * The maximum value.
   */
  max: number;
  /**
   * The percentage of the current value.
   */
  percentage: number | null;
  /**
   * The formatted value.
   */
  formattedValue: string | null;
  /**
   * A string value that provides a human-readable text alternative for the current value.
   */
  ariaValueText?: string;
  /**
   * Present when the progress has completed.
   */
  isComplete: boolean;
  /**
   * Present when the progress is in indeterminate state.
   */
  isIndeterminate: boolean;
  /**
   * Present while the progress is progressing.
   */
  isProgressing: boolean;
}

export interface ProgressRootProps
  extends Omit<ViewProps, 'style' | 'children'>, WebProgressAccessibilityProps {
  /**
   * The current value. The component is indeterminate when value is null.
   * @default null
   */
  value?: number | null;
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
   * Accepts a function which returns a string value that provides a human-readable text alternative for the current value.
   */
  getAriaValueText?: (
    formattedValue: string | null,
    value: number | null,
  ) => string;
  /**
   * The locale used by Intl.NumberFormat when formatting the value.
   * Defaults to the user's runtime locale.
   */
  locale?: string;
  /**
   * Options to format the value.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * The style of the component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ProgressState) => StyleProp<ViewStyle>);
  /**
   * The child elements or a render function.
   */
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
}

export interface ProgressLabelProps
  extends TextProps, WebProgressAccessibilityProps {}

export interface ProgressTrackProps
  extends ViewProps, WebProgressAccessibilityProps {}

export interface ProgressIndicatorProps
  extends ViewProps, WebProgressAccessibilityProps {}

export interface ProgressValueProps
  extends Omit<TextProps, 'children'>, WebProgressAccessibilityProps {
  /**
   * A function that returns a ReactNode based on the formatted value and current value.
   */
  children?: (
    formattedValue: string | null,
    value: number | null,
  ) => React.ReactNode;
}

export interface ProgressContextValue extends ProgressState {
  labelId?: string;
}
