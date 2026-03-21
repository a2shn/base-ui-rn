import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
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
      children,
      disabled = false,
      accessibilityState,
      style,
      'aria-label': ariaLabel,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-disabled': ariaDisabled,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      minStepsBetweenValues,
      maxStepsBetweenValues,
      stepBetweenValues,
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
      setTrackSize,
      setThumbSize,
      trackSize,
    } = useSlider(props);

    const thumbRefs = React.useRef<(View | null)[]>([]);

    const contextValue = React.useMemo(
      () => ({
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
          ref={ref}
          accessible
          accessibilityState={{ disabled, ...accessibilityState }}
          aria-label={ariaLabel}
          aria-keyshortcuts={ariaKeyshortcuts}
          aria-disabled={ariaDisabled ?? disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          data-orientation={state.orientation}
          data-disabled={disabled}
          data-min-steps-between-values={minStepsBetweenValues}
          data-max-steps-between-values={maxStepsBetweenValues}
          data-step-between-values={stepBetweenValues}
          style={evaluateStyles(style, state)}
        >
          {evaluateStyles(children, state)}
        </View>
      </SliderContext.Provider>
    );
  }),
);

SliderRoot.displayName = 'Slider.Root';
