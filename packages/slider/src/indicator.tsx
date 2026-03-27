import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useSliderContext } from './context';
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
 *   <Slider.Indicator />
 * </Slider.Track>
 * ```
 */
export const SliderIndicator = React.memo(
  React.forwardRef<View, SliderIndicatorProps>(
    function SliderIndicator(props, ref) {
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

      const dynamicStyle =
        React.useMemo((): import('react-native').ViewStyle => {
          const isRange = state.value.length > 1;
          const minValue = isRange ? (state.value[0] ?? state.min) : state.min;
          const maxValue = state.value[state.value.length - 1] ?? state.max;
          const range = state.max - state.min || 1;
          const start = ((minValue - state.min) / range) * 100;
          const end = ((maxValue - state.min) / range) * 100;

          return state.orientation === 'horizontal'
            ? {
                height: '100%',
                left: `${start}%` as never,
                position: 'absolute',
                width: `${Math.max(end - start, 0)}%` as never,
              }
            : {
                bottom: `${start}%` as never,
                height: `${Math.max(end - start, 0)}%` as never,
                position: 'absolute',
                width: '100%',
              };
        }, [state.value, state.min, state.max, state.orientation]);

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
          style={[dynamicStyle, resolvedStyle]}
        />
      );
    },
  ),
);

SliderIndicator.displayName = 'Slider.Indicator';
