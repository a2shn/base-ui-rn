import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { useSliderControl } from './use-slider-control';
import { getWebControlStyles } from './styles';

/**
 * A wrapper that provides pan gesture handling for slider interaction.
 *
 * Hosts the track and thumb elements and handles drag interactions.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Control>
 *     <Slider.Track />
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderControl = React.memo(
  React.forwardRef<View, ViewProps>(function SliderControl(props, ref) {
    const { onLayout, style, ...otherProps } = props;
    const { handleOnLayout, mergedRef, panHandlers, tabIndex } =
      useSliderControl({ onLayout });

    const resolvedStyle = resolveValue(style, {})
    const mergedProps = mergeProps(otherProps, { ref }, {
      ...panHandlers,
      focusable: false,

      onLayout: handleOnLayout,
      ref: mergedRef,
    });

    return <View {...mergedProps} tabIndex={tabIndex} style={[resolvedStyle, getWebControlStyles()]}
    />;
  }),
);

SliderControl.displayName = 'Slider.Control';
