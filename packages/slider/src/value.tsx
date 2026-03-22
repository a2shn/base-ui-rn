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
  React.forwardRef<Text, SliderValueProps>(function SliderValue(props, ref) {
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
    const { formatter, state } = useSliderContext();

    const formatted = React.useMemo(() => {
      return state.value.map((item) =>
        formatter ? formatter.format(item) : item.toString(),
      );
    }, [state.value, formatter]);

    return (
      <Text
        {...other}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-disabled={state.disabled}
        data-dragging={state.dragging}
        data-focused={state.activeIndex !== null}
        data-orientation={state.orientation}
        ref={ref}
      >
        {typeof children === 'function'
          ? children(formatted, state.value)
          : (children ?? formatted.join(', '))}
      </Text>
    );
  }),
);

SliderValue.displayName = 'Slider.Value';
