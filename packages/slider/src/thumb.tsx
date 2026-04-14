import {
  mergeProps,
  PressableWithKeyDown,
  resolveValue,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type View } from 'react-native';

import { getThumbDynamicStyles, getWebThumbStyles } from './styles';
import type { SliderThumbProps } from './types';
import { useSliderThumb } from './use-slider-thumb';

/**
 * The interactive handle for adjusting the slider value.
 *
 * Supports keyboard navigation, accessibility, and custom value text.
 * Must be used within a Slider.Control or Slider.Track.
 *
 * @example
 * ```tsx
 * <Slider.Root defaultValue={50}>
 * <Slider.Control>
 * <Slider.Thumb />
 * </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderThumb = React.memo(
  React.forwardRef<View, SliderThumbProps>(function SliderThumb(props, ref) {
    const { children, index = 0, style, ...otherProps } = props;

    const {
      accessibilityValue,
      focusedThumbIndex,
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handleLayout,
      handlePress,
      internalRef,
      isDisabled,
      state,
      tabIndex,
      thumbAlignment,
      valueNow,
    } = useSliderThumb(props);

    const percent =
      ((valueNow - state.min) / (state.max - state.min || 1)) * 100;

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        accessibilityActions: !isDisabled
          ? [{ name: 'increment' }, { name: 'decrement' }]
          : [],
        accessibilityState: {
          disabled: isDisabled,
          selected: focusedThumbIndex === index,
        },
        onAccessibilityAction: handleAccessibilityAction,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onLayout: handleLayout,
        onPress: handlePress,
        ref: internalRef,
      },
      { ref },
      otherProps,
      { accessible: true },
    );

    return (
      <PressableWithKeyDown
        {...mergedProps}
        accessibilityValue={accessibilityValue}
        style={[
          resolvedStyle,
          getThumbDynamicStyles(
            percent,
            state.orientation,
            thumbAlignment ?? 'edge',
          ),
          focusRingStyle,
          getWebThumbStyles(),
        ]}
        tabIndex={tabIndex}
      >
        {resolveValue(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

SliderThumb.displayName = 'Slider.Thumb';
