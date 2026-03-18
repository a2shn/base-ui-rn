import * as React from 'react';
import { View } from 'react-native';
import { resolveTabIndex, evaluateStyles } from '@base-ui-rn/core';
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
      thumbNodeHandles,
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
        thumbNodeHandles,
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
      ],
    );

    return (
      <SliderContext.Provider value={contextValue}>
        <View
          {...otherProps}
          ref={ref}
          accessible
          role={accessibilityRole as never}
          accessibilityRole={accessibilityRole}
          accessibilityState={{ disabled, ...accessibilityState }}
          tabIndex={resolveTabIndex(disabled, tabIndex)}
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
