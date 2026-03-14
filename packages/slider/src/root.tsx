import * as React from 'react';
import { View } from 'react-native';
import type { SliderRootProps } from './types';
import { SliderContext } from './context';
import { useSliderRoot } from './use-slider';

/**
 * The root component of the Slider.
 * Provides state and logic to all sub-components via context.
 *
 * @example
 * ```tsx
 * <Slider.Root defaultValue={20}>
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Thumb />
 *     </Slider.Track>
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderRoot = React.forwardRef<View, SliderRootProps>(
  (props, ref) => {
    const {
      children,
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherViewProps
    } = props;

    const {
      state,
      onLayout,
      onThumbLayout,
      panHandlers,
      handleKeyDown,
      setThumbValue,
      onThumbFocus,
      onThumbBlur,
      thumbAlignment,
      thumbSize,
      controlRef,
    } = useSliderRoot(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        setThumbValue,
        onThumbDragStart: () => {}, // Handled by PanResponder
        onThumbDragEnd: () => {}, // Handled by PanResponder
        onThumbFocus,
        onThumbBlur,
        onLayout,
        onThumbLayout,
        panHandlers,
        handleKeyDown,
        thumbAlignment,
        thumbSize,
        controlRef,
      }),
      [
        state,
        setThumbValue,
        onThumbFocus,
        onThumbBlur,
        onLayout,
        onThumbLayout,
        panHandlers,
        handleKeyDown,
        thumbAlignment,
        thumbSize,
        controlRef,
      ],
    );

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <SliderContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          ref={ref}
          style={style}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          data-dragging={state.draggingIndex !== -1 ? 'true' : undefined}
          data-orientation={state.orientation}
          data-disabled={state.disabled ? 'true' : undefined}
        >
          {resolvedChildren}
        </View>
      </SliderContext.Provider>
    );
  },
);

SliderRoot.displayName = 'Slider.Root';
