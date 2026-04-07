import * as React from 'react';
import { Text } from 'react-native';

import { useSliderContext } from './context';
import type { SliderValueProps } from './types';
import { useFormatter } from '@base-ui-rn/core';

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
  React.forwardRef<Text, SliderValueProps>(function SliderValue(props, ref) {
    const { children, ...otherProps } = props;
    const { format, locale, state } = useSliderContext();

    const { formattedValues } = useFormatter(state.value, {
      formatOptions: format,
      locale: locale,
    });

    return (
      <Text {...otherProps} ref={ref}>
        {typeof children === 'function'
          ? children(formattedValues, state.value)
          : (children ?? formattedValues.join(', '))}
      </Text>
    );
  }),
);

SliderValue.displayName = 'Slider.Value';
