import {
  mergeProps,
  resolveValue,
} from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { SliderContext } from './context';
import type { SliderRootProps } from './types';
import { useSlider } from './use-slider';

/**
 * Headless slider root primitive for React Native.
 *
 * Stores slider state and provides context for all slider sub-components,
 * including single-value and range slider usage.
 *
 * @example
 * ```tsx
 * <Slider.Root defaultValue={25}>
 * <Slider.Control>
 * <Slider.Track>
 * <Slider.Indicator />
 * <Slider.Thumb />
 * </Slider.Track>
 * </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderRoot = React.memo(
  React.forwardRef<View, SliderRootProps>(function SliderRoot(props, ref) {
    const {
      children,
      style,
      ...otherProps
    } = props;

    const {
      commitValue,
      focusedThumbIndex,
      focusThumb,
      format,
      largeStep,
      locale,
      setDragging,
      setFocusedThumbIndex,
      setThumbSize,
      setTrackSize,
      setValueAtIndex,
      state,
      stepBy,
      thumbAlignment,
      thumbNodeHandles,
      thumbRefs,
      tabIndex,
      isDisabled,
    } = useSlider(props);

    const contextValue = React.useMemo(
      () => ({
        commitValue,
        focusedThumbIndex,
        focusThumb,
        format,
        largeStep,
        locale,
        setDragging,
        setFocusedThumbIndex,
        setThumbSize,
        setTrackSize,
        setValueAtIndex,
        state,
        stepBy,
        thumbAlignment,
        thumbNodeHandles,
        thumbRefs,
      }),
      [
        state,
        setValueAtIndex,
        stepBy,
        commitValue,
        locale,
        format,
        largeStep,
        thumbAlignment,
        setTrackSize,
        setThumbSize,
        thumbRefs,
        thumbNodeHandles,
        focusedThumbIndex,
        setFocusedThumbIndex,
        focusThumb,
        setDragging,
      ],
    );

    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
    {
      accessibilityState: { disabled: isDisabled },
    },
    { ref },
    otherProps,
    {
      accessible: true,
      role: "adjustable"
    }
  );

    return (
      <SliderContext.Provider value={contextValue}>
        <View
          {...mergedProps}
          style={resolvedStyle}
          tabIndex={tabIndex}
        >
          {resolveValue(children, state)}
        </View>
      </SliderContext.Provider>
    );
  }),
);

SliderRoot.displayName = 'Slider.Root';
