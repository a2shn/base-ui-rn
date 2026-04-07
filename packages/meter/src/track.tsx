import { mergeProps, resolveValue } from '@base-ui-rn/core';
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
    const { children, style, ...otherProps } = props;
    const context = useMeterContext();

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

MeterTrack.displayName = 'Meter.Track';
