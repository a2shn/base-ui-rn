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
      const isEdge = context.thumbAlignment === 'edge';
      const start =
        context.percentages.length > 1 ? Math.min(...context.percentages) : 0;
      const end = Math.max(...context.percentages);
      const size = end - start;

      if (isHorizontal) {
        if (isEdge && context.thumbSize > 0) {
          // For 'edge' alignment, we need to adjust the indicator to match the thumb centers.
          // The thumb centers move within a range of (trackWidth - thumbSize).
          // Indicator start = (start/100) * (trackWidth - thumbSize) + thumbSize/2
          // But we use percentage positioning for indicator too.
          return {
            position: 'absolute',
            left: `${start}%`,
            width: `${size}%`,
            height: '100%',
            marginLeft:
              context.thumbSize / 2 - (start / 100) * context.thumbSize,
            marginRight:
              -(context.thumbSize / 2) + (end / 100) * context.thumbSize,
            // A simpler way to handle width adjustment with margins:
            // The indicator's visual width needs to shrink by context.thumbSize * (size / 100)
            // but margin-based width adjustment in absolute positioning is tricky.
            // Let's use scale or just standard centers.
          };
        }
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
    }, [
      context.percentages,
      context.orientation,
      context.thumbAlignment,
      context.thumbSize,
    ]);

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
