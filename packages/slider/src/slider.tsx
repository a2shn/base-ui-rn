import { evaluateStyles, resolveTabIndex } from '@base-ui-rn/core';
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
      accessibilityRole = 'adjustable',
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
      tabIndex,
      ...otherProps
    } = props;

    const {
      commitValue,
      focusedThumbIndex,
      focusThumb,
      format,
      formatter,
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
    } = useSlider(props);

    const contextValue = React.useMemo(
      () => ({
        commitValue,
        focusedThumbIndex,
        focusThumb,
        format,
        formatter,
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
        formatter,
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

    return (
      <SliderContext.Provider value={contextValue}>
        <View
          {...otherProps}
          accessibilityRole={accessibilityRole}
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
          data-dragging={state.dragging}
          data-focused={focusedThumbIndex !== null}
          data-max-steps-between-values={maxStepsBetweenValues}
          data-min-steps-between-values={minStepsBetweenValues}
          data-orientation={state.orientation}
          data-step-between-values={stepBetweenValues}
          ref={ref}
          role={accessibilityRole as never}
          style={evaluateStyles(style, state)}
          tabIndex={resolveTabIndex(disabled, tabIndex)}
        >
          {evaluateStyles(children, state)}
        </View>
      </SliderContext.Provider>
    );
  }),
);

SliderRoot.displayName = 'Slider.Root';
