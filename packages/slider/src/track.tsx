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
    { style, ...props },
    ref,
  ) {
    const { state } = useSliderContext();
    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    return (
      <View
        {...props}
        data-disabled={state.disabled}
        data-dragging={state.dragging}
        data-focused={state.activeIndex !== null}
        data-orientation={state.orientation}
        ref={ref}
        style={resolvedStyle}
      />
    );
  }),
);

SliderTrack.displayName = 'Slider.Track';
