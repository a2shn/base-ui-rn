import * as React from 'react';
import { View } from 'react-native';

import type { SliderPartProps } from './types';
import { useSliderControl } from './use-slider-control';

/**
 * Interactive container that wraps the slider track.
 */
export const SliderControl = React.memo(
  React.forwardRef<View, SliderPartProps>(function SliderControl(
    { onLayout, style, ...props },
    ref,
  ) {
    const {
      'data-disabled': dataDisabled,
      'data-dragging': dataDragging,
      'data-focused': dataFocused,
      'data-orientation': dataOrientation,
      handleLayout,
      mergedRef,
      panHandlers,
      resolvedStyle,
      resolvedTabIndex,
    } = useSliderControl({ onLayout, style });

    const mergedRefCallback = React.useCallback(
      (node: View | null) => {
        mergedRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, mergedRef],
    );

    return (
      <View
        {...props}
        {...panHandlers}
        data-disabled={dataDisabled}
        data-dragging={dataDragging}
        data-focused={dataFocused}
        data-orientation={dataOrientation}
        onLayout={handleLayout}
        ref={mergedRefCallback}
        style={resolvedStyle}
        tabIndex={resolvedTabIndex}
      />
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
