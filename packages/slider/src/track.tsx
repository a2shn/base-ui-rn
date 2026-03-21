import * as React from 'react';
import { View } from 'react-native';

import { useSliderContext } from './context';
import type { SliderPartProps } from './types';

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
    { onLayout, style, ...props },
    ref,
  ) {
    const { setTrackSize, state } = useSliderContext();
    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    const handleLayout = React.useCallback(
      (event: import('react-native').LayoutChangeEvent) => {
        const { height, width } = event.nativeEvent.layout;
        setTrackSize(state.orientation === 'horizontal' ? width : height);
        onLayout?.(event);
      },
      [setTrackSize, state.orientation, onLayout],
    );

    return (
      <View
        {...props}
        onLayout={handleLayout}
        ref={ref}
        style={resolvedStyle}
      />
    );
  }),
);

SliderTrack.displayName = 'Slider.Track';
