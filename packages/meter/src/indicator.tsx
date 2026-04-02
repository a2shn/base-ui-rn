import { mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useMeterContext } from './meter-context';
import type { MeterIndicatorProps } from './types';

/**
 * Visualizes the meter's current value.
 *
 * Automatically applies the width based on the meter's percentage.
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Meter.Indicator style={{ backgroundColor: 'blue' }} />
 * ```
 */
export const MeterIndicator = React.memo(
  React.forwardRef<View, MeterIndicatorProps>((props, ref) => {
    const { style } = props;
    const context = useMeterContext();
    const { percentage } = context;

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

    const resolvedStyle = useStyle({
      state: context,
      style,
    });

    const mergedProps = mergeProps(props, {
      handlers: {},
      disabled: false,
      focusable: false,
      ref,
      style: [indicatorStyle, resolvedStyle],
    });

    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        {...mergedProps}
      />
    );
  }),
);

MeterIndicator.displayName = 'Meter.Indicator';
