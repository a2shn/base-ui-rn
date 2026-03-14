import * as React from 'react';
import { View } from 'react-native';
import type { SliderTrackProps } from './types';
import { useSliderContext } from './context';

/**
 * The rail that the slider thumbs move along.
 *
 * @example
 * ```tsx
 * <Slider.Track>
 *   <Slider.Indicator />
 *   <Slider.Thumb />
 * </Slider.Track>
 * ```
 */
export const SliderTrack = React.forwardRef<View, SliderTrackProps>(
  (props, ref) => {
    const { children, style, ...otherViewProps } = props;
    const context = useSliderContext();

    const resolvedChildren =
      typeof children === 'function' ? children(context) : children;

    return (
      <View
        {...otherViewProps}
        ref={ref}
        style={style}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? 'true' : undefined}
      >
        {resolvedChildren}
      </View>
    );
  },
);

SliderTrack.displayName = 'Slider.Track';
