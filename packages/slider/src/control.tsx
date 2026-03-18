import * as React from 'react';
import { View } from 'react-native';
import { useSliderControl } from './use-slider-control';
import type { SliderPartProps } from './types';

/**
 * Interactive container that wraps the slider track.
 */
export const SliderControl = React.memo(
  React.forwardRef<View, SliderPartProps>(function SliderControl(
    { style, onLayout, ...props },
    ref,
  ) {
    const { mergedRef, panHandlers, handleLayout, resolvedStyle } =
      useSliderControl({ style, onLayout });

    return (
      <View
        {...props}
        {...panHandlers}
        ref={(node) => {
          mergedRef(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onLayout={handleLayout}
        style={resolvedStyle}
      />
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
