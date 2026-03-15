import * as React from 'react';
import { View } from 'react-native';
import { resolveTabIndex } from '@base-ui-rn/core';
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
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *       <Slider.Thumb />
 *     </Slider.Track>
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderRoot = React.memo(
  React.forwardRef<View, SliderRootProps>(function SliderRoot(props, ref) {
    const {
      children,
      disabled = false,
      accessibilityRole = 'adjustable',
      accessibilityState,
      style,
      tabIndex,
      'aria-disabled': ariaDisabled,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    } = props;

    const {
      state,
      setValueAtIndex,
      stepBy,
      commitValue,
      locale,
      format,
      largeStep,
      thumbAlignment,
    } = useSlider(props);
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;
    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return (
      <SliderContext.Provider
        value={{
          state,
          setValueAtIndex,
          stepBy,
          commitValue,
          locale,
          format,
          largeStep,
          thumbAlignment,
        }}
      >
        <View
          {...otherProps}
          ref={ref}
          accessible
          role={accessibilityRole as never}
          accessibilityRole={accessibilityRole}
          accessibilityState={{ disabled, ...accessibilityState }}
          tabIndex={resolveTabIndex(disabled, tabIndex)}
          aria-disabled={ariaDisabled ?? disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          style={resolvedStyle}
        >
          {resolvedChildren}
        </View>
      </SliderContext.Provider>
    );
  }),
);

SliderRoot.displayName = 'Slider.Root';
