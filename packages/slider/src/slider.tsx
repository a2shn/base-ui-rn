import { evaluateStyles } from '@base-ui-rn/core';
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
 *   <Slider.Track>
 *     <Slider.Indicator />
 *     <Slider.Thumb />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */
export const SliderRoot = React.memo(
  React.forwardRef<View, SliderRootProps>(function SliderRoot(props, ref) {
    const {
      accessibilityState,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      disabled = false,
      maxStepsBetweenValues,
      minStepsBetweenValues,
      stepBetweenValues,
      style,
      ...otherProps
    } = props;

    const {
      commitValue,
      format,
      largeStep,
      locale,
      setThumbSize,
      setTrackSize,
      setValueAtIndex,
      state,
      stepBy,
      thumbAlignment,
      trackSize,
    } = useSlider(props);

    const thumbRefs = React.useRef<(View | null)[]>([]);

    const contextValue = React.useMemo(
      () => ({
        commitValue,
        format,
        largeStep,
        locale,
        setThumbSize,
        setTrackSize,
        setValueAtIndex,
        state,
        stepBy,
        thumbAlignment,
        thumbRefs,
        trackSize,
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
        trackSize,
      ],
    );

    return (
      <SliderContext.Provider value={contextValue}>
        <View
          {...otherProps}
          accessibilityState={{ disabled, ...accessibilityState }}
          accessible
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={ariaDisabled ?? disabled}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-keyshortcuts={ariaKeyshortcuts}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-disabled={disabled}
          data-max-steps-between-values={maxStepsBetweenValues}
          data-min-steps-between-values={minStepsBetweenValues}
          data-orientation={state.orientation}
          data-step-between-values={stepBetweenValues}
          ref={ref}
          style={evaluateStyles(style, state)}
        >
          {evaluateStyles(children, state)}
        </View>
      </SliderContext.Provider>
    );
  }),
);

SliderRoot.displayName = 'Slider.Root';
