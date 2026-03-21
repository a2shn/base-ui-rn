import * as React from 'react';
import { View } from 'react-native';
import { resolveTabIndex, evaluateStyles } from '@base-ui-rn/core';
import type { ProgressRootProps } from './types';
import { ProgressContext } from './progress-context';
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
