import { mergeProps, resolveValue } from '@base-ui-rn/core';
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
      ...otherProps
    } = props;

    const { accessibilityProps, state } = useProgress(props);


    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(props, {
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityLiveRegion: 'polite',
      accessible: true,
      importantForAccessibility: "yes",
      role: "progressbar"
    });

    return (
      <ProgressContext.Provider value={state}>
        <View

          {...mergedProps}

          accessibilityValue={accessibilityProps}
        >
          {resolveValue(children, state)}
        </View>
      </ProgressContext.Provider >
    );
  }),
);

ProgressRoot.displayName = 'Progress.Root';
