import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View, ViewProps } from 'react-native';

import { useSliderContext } from './context';

/**
 * Visual range container for the slider.
 *
 * Hosts the indicator and thumb elements and represents the full min-to-max
 * value range.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Track>
 *     <Slider.Indicator />
 *     <Slider.Thumb />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */
export const SliderTrack = React.memo(
  React.forwardRef<View, ViewProps>(function SliderTrack(props, ref) {
    const { style, ...otherProps } = props;
    const { state } = useSliderContext();
    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
    { style: resolvedStyle },
    { ref },
    otherProps,
    { focusable: false }
  );

    return <View {...mergedProps} />;
  }),
);

SliderTrack.displayName = 'Slider.Track';
