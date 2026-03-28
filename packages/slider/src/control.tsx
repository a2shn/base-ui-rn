import * as React from 'react';
import { View } from 'react-native';

import type { SliderPartProps } from './types';
import { useSliderControl } from './use-slider-control';

/**
 * Interactive container that wraps the slider track.
 */
export const SliderControl = React.memo(
  React.forwardRef<View, SliderPartProps>(function SliderControl(props, ref) {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      onLayout,
      style,
      ...otherProps
    } = props;
    const {
      'data-disabled': dataDisabled,
      'data-dragging': dataDragging,
      'data-focused': dataFocused,
      'data-orientation': dataOrientation,
      handleLayout,
      mergedRef,
      panHandlers,
      resolvedStyle,
      tabIndex,
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
        {...otherProps}
        {...panHandlers}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden ?? true}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-disabled={dataDisabled}
        data-dragging={dataDragging}
        data-focused={dataFocused}
        data-orientation={dataOrientation}
        focusable={false}
        onLayout={handleLayout}
        ref={mergedRefCallback}
        style={resolvedStyle}
        tabIndex={tabIndex}
      />
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
