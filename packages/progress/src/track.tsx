import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
    const { children, style } = props;
    const context = useProgressContext();

    const resolvedStyle = useStyle({
      state: context,
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        {...mergedProps}
      >
        {evaluateStyles(children, context)}
      </View>
    );
  }),
);

ProgressTrack.displayName = 'Progress.Track';
