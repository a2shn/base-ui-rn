import * as React from 'react';
import { Text } from 'react-native';
import type { SliderLabelProps } from './types';

/**
 * Accessible text label for a slider.
 *
 * Use this component to provide a visible label that describes what value the
 * slider controls.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Label>Volume</Slider.Label>
 * </Slider.Root>
 * ```
 */
export const SliderLabel = React.memo(
  React.forwardRef<Text, SliderLabelProps>(function SliderLabel(props, ref) {
    return <Text {...props} ref={ref} />;
  }),
);

SliderLabel.displayName = 'Slider.Label';
