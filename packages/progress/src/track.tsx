import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressTrackProps } from './types';

/**
 * Contains the progress indicator and represents the entire range of the progress bar.
 *
 * @example
 * ```tsx
 * <Progress.Track><Progress.Indicator /></Progress.Track>
 * ```
 */
export const ProgressTrack = React.memo(
  React.forwardRef<View, ProgressTrackProps>((props, ref) => {
    const { children, style, ...otherProps } = props;
    const context = useProgressContext();

    const resolvedStyle = resolveValue(style, context)

    const mergedProps = mergeProps(
    { style: resolvedStyle },
    { ref },
    otherProps,
    {
      accessibilityElementsHidden: true,
      focusable: false,
      importantForAccessibility: "no-hide-descendants"
    }
  );

    return (
      <View
        {...mergedProps}
      >
        {resolveValue(children, context)}
      </View>
    );
  }),
);

ProgressTrack.displayName = 'Progress.Track';
