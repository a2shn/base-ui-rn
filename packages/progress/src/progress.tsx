import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
 * <Progress.Label>Export data</Progress.Label>
 * <Progress.Track><Progress.Indicator /></Progress.Track>
 * </Progress.Root>
 * ```
 */
export const ProgressRoot = React.memo(
  React.forwardRef<View, ProgressRootProps>((props, ref) => {
    const {
      accessibilityLabel,
      accessibilityLiveRegion,
      children,
      style,
    } = props;

    const { computedAccessibilityValue, labelId, state } = useProgress(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        labelId,
      }),
      [state, labelId],
    );

    const resolvedStyle = useStyle({ state, style });

    const mergedProps = mergeProps(props, {
      handlers: {},
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <ProgressContext.Provider value={contextValue}>
        <View
          accessibilityLiveRegion={accessibilityLiveRegion ?? 'polite'}
          accessibilityValue={computedAccessibilityValue}
          accessible={true}
          aria-labelledby={accessibilityLabel ? undefined : labelId}
          importantForAccessibility="yes"
          role="progressbar"
          {...mergedProps}
        >
          {evaluateStyles(children, state)}
        </View>
      </ProgressContext.Provider>
    );
  }),
);

ProgressRoot.displayName = 'Progress.Root';
