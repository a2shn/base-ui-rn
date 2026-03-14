import * as React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import type { SliderControlProps } from './types';
import { useSliderContext } from './context';

/**
 * The interactive area of the Slider.
 * Handles pointer events and maps them to slider values.
 *
 * @example
 * ```tsx
 * <Slider.Control>
 *   <Slider.Track />
 * </Slider.Control>
 * ```
 */
export const SliderControl = React.forwardRef<View, SliderControlProps>(
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
        onLayout={context.onLayout}
      >
        <Pressable
          accessibilityRole='button'
          onPressIn={context.handlePointerDown}
          onPressOut={context.handlePointerUp}
          style={StyleSheet.absoluteFill}
          disabled={context.disabled}
        />
        {resolvedChildren}
      </View>
    );
  },
);

SliderControl.displayName = 'Slider.Control';
