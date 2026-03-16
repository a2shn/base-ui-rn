import * as React from 'react';
import { Text } from 'react-native';
import { evaluate } from '@base-ui-rn/core';
import type { SliderLabelProps } from './types';
import { useSliderContext } from './context';

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
    const {
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    const { state } = useSliderContext();

    return (
      <Text
        {...other}
        ref={ref}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
      >
        {evaluate(children, state)}
      </Text>
    );
  }),
);

SliderLabel.displayName = 'Slider.Label';
