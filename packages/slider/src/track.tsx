import { evaluateStyles } from '@base-ui-rn/core';
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
  React.forwardRef<View, SliderPartProps>(function SliderTrack(props, ref) {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      style,
      ...otherProps
    } = props;
    const { state } = useSliderContext();
    const resolvedStyle = evaluateStyles(style, state);
    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden ?? true}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-disabled={state.disabled ? 'true' : undefined}
        data-dragging={state.dragging ? 'true' : undefined}
        data-focused={state.activeIndex !== null ? 'true' : undefined}
        data-orientation={state.orientation}
        focusable={false}
        ref={ref}
        style={resolvedStyle}
      />
    );
  }),
);

SliderTrack.displayName = 'Slider.Track';
