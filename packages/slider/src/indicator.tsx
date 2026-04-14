import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useSliderContext } from './context';
import { getIndicatorDynamicStyles } from './styles';
import type { SliderIndicatorProps } from './types';
/**
 * Visual indicator that fills according to the slider value.
 *
 * For range sliders, the first and last values are used to calculate the
 * indicator start and end positions.
 *
 * @example
 * ```tsx
 * <Slider.Track>
 * <Slider.Indicator />
 * </Slider.Track>
 * ```
 */
export const SliderIndicator = React.memo(
  React.forwardRef<View, SliderIndicatorProps>(
    function SliderIndicator(props, ref) {
      const { style, ...otherProps } = props;
      const { state } = useSliderContext();

      const resolvedStyle = resolveValue(style, state);

      const mergedProps = mergeProps({}, { ref }, otherProps);

      return (
        <View
          {...mergedProps}
          style={[
            resolvedStyle,
            getIndicatorDynamicStyles(
              state.value,
              state.min,
              state.max,
              state.orientation,
            ),
          ]}
        />
      );
    },
  ),
);

SliderIndicator.displayName = 'Slider.Indicator';
