import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressTrackProps } from './types';

/**
 * Contains the progress indicator and represents the entire range of the progress bar.
 *
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Progress.Track><Progress.Indicator /></Progress.Track>
 * ```
 */
export const ProgressTrack = React.memo(
  React.forwardRef<View, ProgressTrackProps>((props, ref) => {
    const { children, style } = props;
    const context = useProgressContext();

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <View
        {...props}
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={resolvedStyle}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

ProgressTrack.displayName = 'Progress.Track';
