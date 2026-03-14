import * as React from 'react';
import { View } from 'react-native';
import { mergeRefs } from '@base-ui-rn/core';
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

    const mergedRef = React.useMemo(
      () => mergeRefs([ref, context.controlRef] as unknown as React.Ref<View>),
      [ref, context.controlRef],
    );

    const resolvedChildren =
      typeof children === 'function' ? children(context) : children;

    return (
      <View
        {...otherViewProps}
        {...context.panHandlers}
        ref={mergedRef}
        style={style}
        onLayout={context.onLayout}
      >
        {resolvedChildren}
      </View>
    );
  },
);

SliderControl.displayName = 'Slider.Control';
