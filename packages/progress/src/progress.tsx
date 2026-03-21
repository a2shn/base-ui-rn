import { evaluateStyles, resolveTabIndex } from '@base-ui-rn/core';
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
      accessibilityHint = 'Displays a value within a range',
      accessibilityLabel,
      accessibilityRole = 'progressbar',
      accessible = true,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-labelledby': ariaLabelledBy,
      'aria-valuemax': ariaValueMax,
      'aria-valuemin': ariaValueMin,
      'aria-valuenow': ariaValueNow,
      'aria-valuetext': ariaValueTextProp,
      children,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      focusable = false,
      importantForAccessibility = 'yes',
      max = 100,
      min = 0,
      style,
      tabIndex,
      ...otherViewProps
    } = props;

    const { labelId, mergedAccessibilityState, state } = useProgress(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        labelId,
      }),
      [state, labelId],
    );

    const resolvedTabIndex = resolveTabIndex(false, tabIndex);
    const isLabelledByProp = Boolean(accessibilityLabel);

    const resolvedStyle = evaluateStyles(style, state);
    const resolvedChildren = evaluateStyles(children, state);

    return (
      <ProgressContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityLabelledBy={isLabelledByProp ? undefined : [labelId]}
          accessibilityState={mergedAccessibilityState}
          accessibilityValue={
            state.isIndeterminate
              ? undefined
              : state.ariaValueText
                ? { text: state.ariaValueText }
                : {
                    max,
                    min,
                    now: state.value!,
                  }
          }
          accessible={accessible}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-labelledby={
            ariaLabelledBy ?? (isLabelledByProp ? undefined : labelId)
          }
          aria-valuemax={ariaValueMax ?? max}
          aria-valuemin={ariaValueMin ?? min}
          aria-valuenow={ariaValueNow ?? state.value ?? undefined}
          aria-valuetext={ariaValueTextProp ?? state.ariaValueText}
          focusable={focusable}
          importantForAccessibility={importantForAccessibility}
          ref={ref}
          role={(accessibilityRole ?? 'progressbar') as unknown as 'checkbox'}
          style={resolvedStyle}
          tabIndex={resolvedTabIndex}
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
  }),
);

ProgressRoot.displayName = 'Progress.Root';
