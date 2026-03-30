import { evaluateStyles } from '@base-ui-rn/core';
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

MeterTrack.displayName = 'Meter.Track';
