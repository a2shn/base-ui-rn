import * as React from 'react';
import { Text } from 'react-native';
import { useSliderContext } from './context';
import type { SliderValueProps } from './types';

/**
 * Text output for the current slider value.
 *
 * By default it renders comma-separated values for range sliders and supports
 * a render function for custom formatting.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Value />
 * </Slider.Root>
 * ```
 */
export const SliderValue = React.memo(
  React.forwardRef<Text, SliderValueProps>(function SliderValue(
    { children, ...props },
    ref,
  ) {
    const { state } = useSliderContext();
    const formatted = state.value.map((item) => item.toString());

    return (
      <Text {...props} ref={ref}>
        {typeof children === 'function'
          ? children(formatted, state.value)
          : (children ?? formatted.join(', '))}
      </Text>
    );
  }),
);

SliderValue.displayName = 'Slider.Value';
