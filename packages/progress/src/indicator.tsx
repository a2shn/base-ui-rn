import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressIndicatorProps } from './types';

/**
 * Visualizes the progress bar's completion status.
 *
 * Automatically applies the width based on the progress's percentage.
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Progress.Indicator style={{ backgroundColor: 'blue' }} />
 * ```
 */
export const ProgressIndicator = React.memo(
  React.forwardRef<View, ProgressIndicatorProps>((props, ref) => {
    const { style } = props;
    const context = useProgressContext();
    const { percentage } = context;

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      if (typeof percentage !== 'number') return {};
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

    const resolvedStyle = evaluateStyles(style, context);

    return (
      <View
        {...props}
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={[indicatorStyle, resolvedStyle]}
      />
    );
  }),
);

ProgressIndicator.displayName = 'Progress.Indicator';
