import {
  type ARIABaseProps,
  type ARIALiveProps,
  ARIATraitRange,
} from '@base-ui-rn/core';
import type * as React from 'react';
import type {
  StyleProp,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * Web-specific accessibility props for the Progress component.
 */
export type WebProgressAccessibilityProps = ARIABaseProps &
  ARIALiveProps &
  ARIATraitRange & {
    /**
     * Present when the progress is complete.
     */
    'data-complete'?: '';
    /**
     * Present when the progress is indeterminate.
     */
    'data-indeterminate'?: '';
    /**
     * Present when the progress is in progress.
     */
    'data-progressing'?: '';
  };

/**
 * Represents the state of the progress bar.
 */
export interface ProgressState {
  /** The current value of the progress bar. */
  value: number | null;
  /** The minimum value of the progress bar. */
  min: number;
  /** The maximum value of the progress bar. */
  max: number;
  /** The percentage of completion. */
  percentage: number | null;
  /** The formatted value string. */
  formattedValue: string | null;
  /** The accessible text for the current value. */
  ariaValueText?: string;
  /** Whether the progress is complete. */
  isComplete: boolean;
  /** Whether the progress is indeterminate. */
  isIndeterminate: boolean;
  /** Whether the progress is ongoing. */
  isProgressing: boolean;
}

export interface ProgressRootProps
  extends Omit<ViewProps, 'children' | 'style'>, WebProgressAccessibilityProps {
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
   * A string representation of the current value for screen readers.
   */
  'aria-valuetext'?: string;
  /**
   * A function to generate a string representation of the current value for screen readers.
   */
  getAriaValueText?: (
    formattedValue: string | null,
    value: number | null,
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
    | ((state: ProgressState) => StyleProp<ViewStyle>);
  /**
   * Children of the root component.
   */
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
}

export interface ProgressLabelProps
  extends Omit<TextProps, 'children' | 'style'>, WebProgressAccessibilityProps {
  /**
   * Children of the label component.
   */
  children?:
    | React.ReactNode
    | ((state: ProgressContextValue) => React.ReactNode);
  /**
   * Style of the label component.
   */
  style?:
    | StyleProp<TextStyle>
    | ((state: ProgressContextValue) => StyleProp<TextStyle>);
}

export interface ProgressTrackProps
  extends Omit<ViewProps, 'children' | 'style'>, WebProgressAccessibilityProps {
  /**
   * Children of the track component.
   */
  children?:
    | React.ReactNode
    | ((state: ProgressContextValue) => React.ReactNode);
  /**
   * Style of the track component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ProgressContextValue) => StyleProp<ViewStyle>);
}

export interface ProgressIndicatorProps
  extends Omit<ViewProps, 'style'>, WebProgressAccessibilityProps {
  /**
   * Style of the indicator component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ProgressContextValue) => StyleProp<ViewStyle>);
}

export interface ProgressValueProps
  extends Omit<TextProps, 'children' | 'style'>, WebProgressAccessibilityProps {
  /**
   * Children of the value component.
   */
  children?: (
    formattedValue: string | null,
    value: number | null,
  ) => React.ReactNode;
  /**
   * Style of the value component.
   */
  style?:
    | StyleProp<TextStyle>
    | ((
        formattedValue: string | null,
        value: number | null,
      ) => StyleProp<TextStyle>);
}

/**
 * The context value for the Progress component.
 */
export interface ProgressContextValue extends ProgressState {
  /**
   * The ID of the label element.
   */
  labelId?: string;
}
