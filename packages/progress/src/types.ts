import type * as React from 'react';
import type {
  StyleProp,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

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
  /** The percentage of completion (0-100). */
  percentage: number | null;
  /** The human-readable value string. */
  formattedValue: string | null;
  /** Whether the progress is complete. */
  isComplete: boolean;
  /** Whether the progress is indeterminate. */
  isIndeterminate: boolean;
  /** Whether the progress is ongoing. */
  isProgressing: boolean;
}

export interface ProgressRootProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
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
   * A function to generate a human-readable representation of the value for screen readers.
   */
  getAccessibilityValueText?: (
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
  defaultValue?: number
}

export interface ProgressLabelProps extends Omit<
  TextProps,
  'children' | 'style'
> {
  /**
   * Children of the label component.
   */
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
  /**
   * Style of the label component.
   */
  style?:
  | StyleProp<TextStyle>
  | ((state: ProgressState) => StyleProp<TextStyle>);
}

export interface ProgressTrackProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
  /**
   * Children of the track component.
   */
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
  /**
   * Style of the track component.
   */
  style?:
  | StyleProp<ViewStyle>
  | ((state: ProgressState) => StyleProp<ViewStyle>);
}

export interface ProgressIndicatorProps extends Omit<ViewProps, 'style'> {
  /**
   * Style of the indicator component.
   */
  style?:
  | StyleProp<ViewStyle>
  | ((state: ProgressState) => StyleProp<ViewStyle>);
}

export interface ProgressValueProps extends Omit<
  TextProps,
  'children' | 'style'
> {
  /**
   * Children of the value component.
   */
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
  /**
   * Style of the value component.
   */
  style?:
  | StyleProp<TextStyle>
  | ((state: ProgressState) => StyleProp<TextStyle>);
}

/**
 * The context value for the Progress component.
 */
export interface ProgressContextValue extends ProgressState {
  /**
   * The ID of the label element.
   */
  labelId: string;
}
