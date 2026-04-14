import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { getWebControlStyles } from './styles';
import { useSliderControl } from './use-slider-control';

/**
 * A wrapper that provides pan gesture handling for slider interaction.
 *
 * Hosts the track and thumb elements and handles drag interactions.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 * <Slider.Control>
 * <Slider.Track />
 * </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderControl = React.memo(
  React.forwardRef<View, ViewProps>(function SliderControl(props, ref) {
    const { onLayout, style, ...otherProps } = props;
    const { handleOnLayout, mergedRef, panHandlers, tabIndex } =
      useSliderControl({ onLayout });

    const resolvedStyle = resolveValue(style, {});
    const mergedProps = mergeProps(
      {
        ...panHandlers,
        onLayout: handleOnLayout,
        ref: mergedRef,
      },
      { ref },
      otherProps,
      { focusable: false },
    );

    return (
      <View
        {...mergedProps}
        style={[resolvedStyle, getWebControlStyles()]}
        tabIndex={tabIndex}
      />
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
