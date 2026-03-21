import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import { useSliderContext } from './context';
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
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      ...other
    } = props;
    const { state } = useSliderContext();

    return (
      <Text
        {...other}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={ref}
      >
        {evaluateStyles(children, state)}
      </Text>
    );
  }),
);

SliderLabel.displayName = 'Slider.Label';
