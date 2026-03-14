import * as React from 'react';
import { View, Text } from 'react-native';
import type { SliderValueProps } from './types';
import { useSliderContext } from './context';

/**
 * Displays the current value(s) of the Slider.
 *
 * @example
 * ```tsx
 * <Slider.Value />
 * ```
 */
export const SliderValue = React.forwardRef<View, SliderValueProps>(
  (props, ref) => {
    const { children, style, format, locale, ...otherViewProps } = props;
    const context = useSliderContext();

    const formattedValues = React.useMemo(() => {
      const formatter = new Intl.NumberFormat(locale, format);
      return context.values.map((v) => formatter.format(v));
    }, [context.values, locale, format]);

    const content = React.useMemo(() => {
      if (typeof children === 'function') {
        return children(formattedValues, context.values);
      }
      return <Text>{formattedValues.join(' - ')}</Text>;
    }, [children, formattedValues, context.values]);

    return (
      <View
        {...otherViewProps}
        ref={ref}
        style={style}
        data-dragging={context.draggingIndex !== -1 ? 'true' : undefined}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? 'true' : undefined}
      >
        {content}
      </View>
    );
  },
);

SliderValue.displayName = 'Slider.Value';
