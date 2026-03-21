import * as React from 'react';
import { View } from 'react-native';
import { useSliderContext } from './context';
import type { SliderPartProps } from './types';
import { evaluateStyles } from '@base-ui-rn/core';

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
  React.forwardRef<View, SliderPartProps>(function SliderTrack(
    { style, onLayout, ...props },
    ref,
  ) {
    const { state, setTrackSize } = useSliderContext();
    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    const handleLayout = React.useCallback(
      (event: import('react-native').LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setTrackSize(state.orientation === 'horizontal' ? width : height);
        onLayout?.(event);
      },
      [setTrackSize, state.orientation, onLayout],
    );

    return (
      <View
        {...props}
        ref={ref}
        onLayout={handleLayout}
        style={resolvedStyle}
      />
    );

  }),
);

SliderTrack.displayName = 'Slider.Track';