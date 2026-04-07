import { PressableWithKeyDown, mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { type View } from 'react-native';

import type { SliderThumbProps } from './types';
import { useSliderThumb } from './use-slider-thumb';
import { getThumbDynamicStyles, getWebThumbStyles } from './styles';


/**
 * The interactive handle for adjusting the slider value.
 *
 * Supports keyboard navigation, accessibility, and custom value text.
 * Must be used within a Slider.Control or Slider.Track.
 *
 * @example
 * ```tsx
 * <Slider.Root defaultValue={50}>
 *   <Slider.Control>
 *     <Slider.Thumb />
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderThumb = React.memo(
  React.forwardRef<View, SliderThumbProps>(function SliderThumb(props, ref) {
    const { getAccessibilityValueText, index = 0, style, children, ...otherProps } = props;


    const {
      focusRingStyle,
      focusedThumbIndex,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handleLayout,
      handlePress,
      internalRef,
      isDisabled,
      state,
      handleAccessibilityAction,
      tabIndex,
      valueNow,
      thumbAlignment,
      accessibilityValue
    } = useSliderThumb(props);


    const percent = ((valueNow - state.min) / (state.max - state.min || 1)) * 100;

    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
      otherProps,
      { ref },
      {
        accessibilityActions: [
          { label: 'increment', name: 'increment' },
          { label: 'decrement', name: 'decrement' },
        ],
        accessibilityState: {
          disabled: isDisabled,
          selected: focusedThumbIndex === index,
        },
        onAccessibilityAction: handleAccessibilityAction,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onLayout: handleLayout,
        onPress: handlePress,
        onBlur: handleBlur,
        ref: internalRef,
        accessible: true
      },
    );

    return (
      <PressableWithKeyDown
        {...mergedProps}
        tabIndex={tabIndex}
        accessibilityValue={accessibilityValue}
        style={[resolvedStyle, getThumbDynamicStyles(percent, state.orientation, thumbAlignment ?? "edge"),
          focusRingStyle,
          getWebThumbStyles()
        ]}

      >
        {resolveValue(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

SliderThumb.displayName = 'Slider.Thumb';
