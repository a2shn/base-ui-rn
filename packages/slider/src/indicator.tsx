import * as React from 'react';
import { View } from 'react-native';
import { useSliderContext } from './context';
import type { SliderPartProps } from './types';

/**
 * Visual indicator that fills according to the slider value.
 *
 * For range sliders, the first and last values are used to calculate the
 * indicator start and end positions.
 *
 * @example
 * ```tsx
 * <Slider.Track>
 *   <Slider.Indicator />
 * </Slider.Track>
 * ```
 */
export const SliderIndicator = React.memo(
  React.forwardRef<View, SliderPartProps>(function SliderIndicator(
    { style, ...props },
    ref,
  ) {
    const { state } = useSliderContext();

    const isRange = state.value.length > 1;
    const minValue = isRange ? (state.value[0] ?? state.min) : state.min;
    const maxValue = state.value[state.value.length - 1] ?? state.max;
    const range = state.max - state.min || 1;
    const start = ((minValue - state.min) / range) * 100;
    const end = ((maxValue - state.min) / range) * 100;

    const dynamicStyle: import('react-native').ViewStyle =
      state.orientation === 'horizontal'
        ? {
            position: 'absolute',
            left: `${start}%` as never,
            width: `${Math.max(end - start, 0)}%` as never,
            height: '100%',
          }
        : {
            position: 'absolute',
            bottom: `${start}%` as never,
            height: `${Math.max(end - start, 0)}%` as never,
            width: '100%',
          };

    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return <View {...props} ref={ref} style={[dynamicStyle, resolvedStyle]} />;
  }),
);

SliderIndicator.displayName = 'Slider.Indicator';
