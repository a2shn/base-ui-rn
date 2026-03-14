import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import type { SliderIndicatorProps } from './types';
import { useSliderContext } from './context';

/**
 * Visualizes the slider's current value range.
 *
 * Automatically applies positioning and sizing based on the slider state.
 *
 * @example
 * ```tsx
 * <Slider.Indicator style={{ backgroundColor: 'blue' }} />
 * ```
 */
export const SliderIndicator = React.forwardRef<View, SliderIndicatorProps>(
  (props, ref) => {
    const { children, style, ...otherViewProps } = props;
    const context = useSliderContext();

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      const isHorizontal = context.orientation === 'horizontal';
      const start =
        context.percentages.length > 1 ? Math.min(...context.percentages) : 0;
      const end = Math.max(...context.percentages);
      const size = end - start;

      if (isHorizontal) {
        return {
          position: 'absolute',
          left: `${start}%`,
          width: `${size}%`,
          height: '100%',
        };
      }

      return {
        position: 'absolute',
        bottom: `${start}%`,
        height: `${size}%`,
        width: '100%',
      };
    }, [context.percentages, context.orientation]);

    const resolvedChildren =
      typeof children === 'function' ? children(context) : children;

    return (
      <View
        {...otherViewProps}
        ref={ref}
        style={[indicatorStyle, style]}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? 'true' : undefined}
      >
        {resolvedChildren}
      </View>
    );
  },
);

SliderIndicator.displayName = 'Slider.Indicator';
