import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressIndicatorProps } from './types';

/**
 * Visualizes the progress bar's completion status.
 *
 * @example
 * ```tsx
 * <Progress.Indicator style={{ backgroundColor: 'blue' }} />
 * ```
 */
export const ProgressIndicator = React.memo(
  React.forwardRef<View, ProgressIndicatorProps>((props, ref) => {
    const { style, ...otherProps } = props;
    const context = useProgressContext();
    const { percentage } = context;

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      if (typeof percentage !== 'number') return {};
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

    const resolvedStyle = resolveValue(style, context)

    const mergedProps = mergeProps(otherProps, {
      focusable: false,
      ref,
      style: [indicatorStyle, resolvedStyle],
      accessibilityElementsHidden: true,
      importantForAccessibility: "no-hide-descendants"
    });

    return (
      <View

        {...mergedProps}
      />
    );
  }),
);

ProgressIndicator.displayName = 'Progress.Indicator';
