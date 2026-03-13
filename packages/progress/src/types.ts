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
   * The current value of the progress bar.
   * @default null
   */
  value?: number | null;
  /**
   * The minimum value of the progress bar.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the progress bar.
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
  getAriaValueText?: (
    formattedValue: string | null,
    value: number | null,
  ) => string;
  /**
   * The locale used for formatting the value.
   */
  locale?: string;
  /**
   * Options for formatting the value.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * Style applied to the root view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ProgressState) => StyleProp<ViewStyle>);
  /**
   * The content of the progress root.
   */
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
}

export interface ProgressLabelProps
  extends TextProps, WebProgressAccessibilityProps {
  /**
   * The content of the label.
   */
  children?: React.ReactNode;
}

export interface ProgressTrackProps
  extends ViewProps, WebProgressAccessibilityProps {
  /**
   * The content of the track.
   */
  children?: React.ReactNode;
}

export interface ProgressIndicatorProps
  extends ViewProps, WebProgressAccessibilityProps {}

export interface ProgressValueProps
  extends Omit<TextProps, 'children'>, WebProgressAccessibilityProps {
  /**
   * A function that returns content based on the formatted value.
   */
  children?: (
    formattedValue: string | null,
    value: number | null,
  ) => React.ReactNode;
}

export interface ProgressContextValue extends ProgressState {
  labelId?: string;
}
