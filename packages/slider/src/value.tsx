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
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    const { state, locale, format } = useSliderContext();

    const formatted = React.useMemo(() => {
      const formatter =
        locale || format ? new Intl.NumberFormat(locale, format) : undefined;
      return state.value.map((item) =>
        formatter ? formatter.format(item) : item.toString(),
      );
    }, [state.value, locale, format]);

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
        {typeof children === 'function'
          ? children(formatted, state.value)
          : (children ?? formatted.join(', '))}
      </Text>
    );
  }),
);

SliderValue.displayName = 'Slider.Value';
