import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { ProgressContext } from './progress-context';
import type { ProgressRootProps } from './types';
import { useProgress } from './use-progress';
import { useProgressA11y } from './use-progress-a11y';

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
      format,
      getAccessibilityValueText,
      locale,
      max,
      min,
      style,
      value,
      ...viewProps
    } = props;

    const { labelId, state } = useProgress(props);
    const a11yProps = useProgressA11y({ labelId, props, state });

    const contextValue = React.useMemo(
      () => ({
        ...state,
        labelId,
      }),
      [state, labelId],
    );

    const resolvedStyle = evaluateStyles(style, state);
    const resolvedChildren = evaluateStyles(children, state);

    return (
      <ProgressContext.Provider value={contextValue}>
        <View
          {...viewProps}
          {...a11yProps}
          focusable={false}
          ref={ref}
          style={resolvedStyle}
        >
          {resolvedChildren}
        </View>
      </ProgressContext.Provider>
    );
  }),
);

ProgressRoot.displayName = 'Progress.Root';
