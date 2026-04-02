import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useMeterContext } from './meter-context';
import type { MeterTrackProps } from './types';

/**
 * Contains the meter indicator and represents the entire range of the meter.
 *
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Meter.Track><Meter.Indicator /></Meter.Track>
 * ```
 */
export const MeterTrack = React.memo(
  React.forwardRef<View, MeterTrackProps>((props, ref) => {
    const { children, style } = props;
    const context = useMeterContext();

    const resolvedStyle = useStyle({
      state: context,
      style,
    });

    const mergedProps = mergeProps(props, {
      handlers: {},
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

MeterTrack.displayName = 'Meter.Track';
