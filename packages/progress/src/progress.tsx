import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { ProgressContext } from './progress-context';
import type { ProgressRootProps } from './types';
import { useProgress } from './use-progress';

/**
 * Headless progress root primitive for React Native.
 *
 * Displays the status of a long-running task. Provides state to its sub-components
 * and ensures proper ARIA attributes for screen readers.
 *
 * @example
 * ```tsx
 * <Progress.Root value={20}>
 *   <Progress.Label>Export data</Progress.Label>
 *   <Progress.Track><Progress.Indicator /></Progress.Track>
 * </Progress.Root>
 * ```
 */
export const ProgressRoot = React.memo(
  React.forwardRef<View, ProgressRootProps>((props, ref) => {
    const {
      accessible = true,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-valuemax': ariaValueMax,
      'aria-valuemin': ariaValueMin,
      'aria-valuenow': ariaValueNow,
      'aria-valuetext': ariaValueTextProp,
      children,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      max = 100,
      min = 0,
      style,
      ...otherViewProps
    } = props;

    const { labelId, state } = useProgress(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        labelId,
      }),
      [state, labelId],
    );

    const resolvedStyle = evaluateStyles(style, state);
    const resolvedChildren = evaluateStyles(children, state);

    const resolvedAriaLabelledBy = ariaLabel
      ? undefined
      : (ariaLabelledBy ?? labelId);

    const resolvedAriaValueText = ariaValueTextProp ?? state.ariaValueText;

    const accessibilityValue = resolvedAriaValueText
      ? { text: resolvedAriaValueText }
      : state.isIndeterminate
        ? undefined
        : {
            max: ariaValueMax ?? max,
            min: ariaValueMin ?? min,
            now: ariaValueNow ?? state.value ?? undefined,
          };

    return (
      <ProgressContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          accessibilityLabelledBy={
            resolvedAriaLabelledBy ? [resolvedAriaLabelledBy] : undefined
          }
          accessibilityState={{
            disabled: false,
          }}
          accessibilityValue={accessibilityValue}
          accessible={accessible}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={resolvedAriaLabelledBy}
          aria-valuemax={ariaValueMax ?? max}
          aria-valuemin={ariaValueMin ?? min}
          aria-valuenow={ariaValueNow ?? state.value ?? undefined}
          aria-valuetext={ariaValueTextProp ?? state.ariaValueText}
          data-complete={
            dataComplete ?? (state.isComplete ? 'true' : undefined)
          }
          data-indeterminate={
            dataIndeterminate ?? (state.isIndeterminate ? 'true' : undefined)
          }
          data-progressing={
            dataProgressing ?? (state.isProgressing ? 'true' : undefined)
          }
          focusable={false}
          importantForAccessibility='yes'
          ref={ref}
          role='progressbar'
          style={resolvedStyle}
        >
          {resolvedChildren}
        </View>
      </ProgressContext.Provider>
    );
  }),
);

ProgressRoot.displayName = 'Progress.Root';
