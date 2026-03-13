import * as React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { resolveTabIndex } from '@base-ui-rn/core';
import type {
  ProgressRootProps,
  ProgressLabelProps,
  ProgressTrackProps,
  ProgressIndicatorProps,
  ProgressValueProps,
} from './types';
import { ProgressContext, useProgressContext } from './progress-context';
import { useProgress } from './use-progress';

/**
 * A high-quality, unstyled React progress bar component that displays the status of a task that takes a long time.
 * Groups all parts of the progress bar and provides the task completion status to screen readers.
 *
 * @example
 * ```tsx
 * <Progress.Root value={20}>
 *   <Progress.Label>Export data</Progress.Label>
 *   <Progress.Value />
 *   <Progress.Track>
 *     <Progress.Indicator style={{ width: '20%' }} />
 *   </Progress.Track>
 * </Progress.Root>
 * ```
 */
export const ProgressRoot = React.forwardRef<View, ProgressRootProps>(
  (props, ref) => {
    const {
      children,
      value = null,
      min = 0,
      max = 100,
      'aria-valuetext': ariaValueTextProp,
      getAriaValueText,
      locale,
      format,
      accessible = true,
      accessibilityRole = 'progressbar',
      accessibilityHint = 'Displays a value within a range',
      accessibilityState,
      accessibilityLabel,
      focusable = false,
      importantForAccessibility = 'yes',
      tabIndex,
      style,
      'aria-valuemin': ariaValueMin,
      'aria-valuemax': ariaValueMax,
      'aria-valuenow': ariaValueNow,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      ...otherViewProps
    } = props;

    const { labelId, mergedAccessibilityState, state } = useProgress({
      value,
      min,
      max,
      locale,
      format,
      ariaValueTextProp,
      getAriaValueText,
      accessibilityState,
    });

    const contextValue = React.useMemo(
      () => ({
        ...state,
        labelId,
      }),
      [state, labelId],
    );

    const resolvedTabIndex = resolveTabIndex(false, tabIndex);
    const isLabelledByProp = Boolean(accessibilityLabel);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <ProgressContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          ref={ref}
          accessible={accessible}
          accessibilityHint={accessibilityHint}
          accessibilityState={mergedAccessibilityState}
          accessibilityLabel={accessibilityLabel}
          focusable={focusable}
          importantForAccessibility={importantForAccessibility}
          role={(accessibilityRole ?? 'progressbar') as unknown as 'checkbox'}
          aria-labelledby={
            ariaLabelledBy ?? (isLabelledByProp ? undefined : labelId)
          }
          accessibilityLabelledBy={isLabelledByProp ? undefined : [labelId]}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          tabIndex={resolvedTabIndex}
          aria-valuemin={ariaValueMin ?? min}
          aria-valuemax={ariaValueMax ?? max}
          aria-valuenow={ariaValueNow ?? state.value ?? undefined}
          aria-valuetext={ariaValueTextProp ?? state.ariaValueText}
          accessibilityValue={
            state.isIndeterminate
              ? undefined
              : state.ariaValueText
                ? { text: state.ariaValueText }
                : {
                    min,
                    max,
                    now: state.value!,
                  }
          }
          style={resolvedStyle}
          {...({
            'data-complete':
              dataComplete ?? (state.isComplete ? '' : undefined),
            'data-indeterminate':
              dataIndeterminate ?? (state.isIndeterminate ? '' : undefined),
            'data-progressing':
              dataProgressing ?? (state.isProgressing ? '' : undefined),
          } as Record<string, unknown>)}
        >
          {resolvedChildren}
        </View>
      </ProgressContext.Provider>
    );
  },
);

ProgressRoot.displayName = 'Progress.Root';

/**
 * An accessible label for the progress bar.
 *
 * Automatically linked to the `Progress.Root` via `aria-labelledby`.
 */
export const ProgressLabel = React.forwardRef<Text, ProgressLabelProps>(
  (props, ref) => {
    const {
      children,
      nativeID,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      ...other
    } = props;
    const { labelId, isComplete, isIndeterminate, isProgressing } =
      useProgressContext();

    return (
      <Text
        {...other}
        ref={ref}
        nativeID={nativeID ?? labelId}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      >
        {children}
      </Text>
    );
  },
);

ProgressLabel.displayName = 'Progress.Label';

/**
 * Contains the progress indicator and represents the entire range of the progress bar.
 *
 * Hidden from accessibility as it's purely visual.
 */
export const ProgressTrack = React.forwardRef<View, ProgressTrackProps>(
  (props, ref) => {
    const {
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      ...other
    } = props;
    const { isComplete, isIndeterminate, isProgressing } = useProgressContext();

    return (
      <View
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      >
        {children}
      </View>
    );
  },
);

ProgressTrack.displayName = 'Progress.Track';

/**
 * Visualizes the completion status of the task.
 *
 * Automatically applies the width (or height if vertical) based on the progress's value.
 * Hidden from accessibility as it's purely visual.
 */
export const ProgressIndicator = React.forwardRef<View, ProgressIndicatorProps>(
  (props, ref) => {
    const {
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      ...other
    } = props;
    const { percentage, isComplete, isIndeterminate, isProgressing } =
      useProgressContext();

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      if (typeof percentage !== 'number') return {};
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

    return (
      <View
        {...other}
        ref={ref}
        style={[indicatorStyle, style]}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      />
    );
  },
);

ProgressIndicator.displayName = 'Progress.Indicator';

/**
 * A text element displaying the current value.
 *
 * Hidden from accessibility to avoid redundant announcements, as the value is
 * provided by `Progress.Root`'s `accessibilityValue`.
 */
export const ProgressValue = React.forwardRef<Text, ProgressValueProps>(
  (props, ref) => {
    const {
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      ...other
    } = props;
    const {
      value,
      formattedValue,
      isComplete,
      isIndeterminate,
      isProgressing,
    } = useProgressContext();

    return (
      <Text
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      >
        {typeof children === 'function'
          ? children(formattedValue, value)
          : formattedValue}
      </Text>
    );
  },
);

ProgressValue.displayName = 'Progress.Value';

export const Progress = {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Value: ProgressValue,
};
