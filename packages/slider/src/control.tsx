import * as React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSliderContext } from './context';
import type { SliderPartProps } from './types';

/**
 * Interactive container that wraps the slider track.
 *
 * Handles all pointer/touch gestures: tap to set value, drag to scrub.
 * Measures its own layout so thumbs can convert % positions to px.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Control>
 *     <Slider.Track />
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const SliderControl = React.memo(
  React.forwardRef<View, SliderPartProps>(function SliderControl(
    { style, onLayout, ...props },
    ref,
  ) {
    const { state, setValueAtIndex, commitValue } = useSliderContext();
    const isHorizontal = state.orientation === 'horizontal';

    // Cache layout so we can compute values from gesture positions
    const layoutRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 });

    const handleLayout = React.useCallback(
      (event: LayoutChangeEvent) => {
        // We need measureInWindow for absolute page coordinates
        (
          event.target as unknown as {
            measureInWindow: (
              cb: (x: number, y: number, width: number, height: number) => void,
            ) => void;
          }
        ).measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            layoutRef.current = { x, y, width, height };
          },
        );
        onLayout?.(event);
      },
      [onLayout],
    );

    /**
     * Convert an absolute page position to a slider value.
     */
    const pagePositionToValue = React.useCallback(
      (pageX: number, pageY: number): number => {
        const { x, y, width, height } = layoutRef.current;

        if (isHorizontal) {
          const ratio = width > 0 ? (pageX - x) / width : 0;
          const clamped = Math.min(Math.max(ratio, 0), 1);
          return state.min + clamped * (state.max - state.min);
        } else {
          // Vertical: bottom = min, top = max
          const ratio = height > 0 ? 1 - (pageY - y) / height : 0;
          const clamped = Math.min(Math.max(ratio, 0), 1);
          return state.min + clamped * (state.max - state.min);
        }
      },
      [isHorizontal, state.min, state.max],
    );

    /**
     * Find the closest thumb index to a raw slider value.
     */
    const closestThumbIndex = React.useCallback(
      (rawValue: number): number => {
        if (state.value.length === 1) return 0;
        let closest = 0;
        let minDist = Infinity;
        state.value.forEach((v, i) => {
          const d = Math.abs(v - rawValue);
          if (d < minDist) {
            minDist = d;
            closest = i;
          }
        });
        return closest;
      },
      [state.value],
    );

    // Track which thumb is being dragged across the gesture lifecycle
    const activeIndexRef = React.useRef(-1);

    const gesture = React.useMemo(() => {
      const updateValue = (absoluteX: number, absoluteY: number) => {
        const rawValue = pagePositionToValue(absoluteX, absoluteY);
        if (activeIndexRef.current === -1) {
          activeIndexRef.current = closestThumbIndex(rawValue);
        }
        setValueAtIndex(activeIndexRef.current, rawValue, 'drag');
      };

      const resetActiveIndex = () => {
        activeIndexRef.current = -1;
        commitValue('drag');
      };

      const pan = Gesture.Pan()
        .enabled(!state.disabled)
        .minDistance(0)
        .shouldCancelWhenOutside(false)
        .onStart((evt) => {
          runOnJS(updateValue)(evt.absoluteX, evt.absoluteY);
        })
        .onUpdate((evt) => {
          runOnJS(updateValue)(evt.absoluteX, evt.absoluteY);
        })
        .onEnd(() => {
          runOnJS(resetActiveIndex)();
        })
        .onFinalize(() => {
          runOnJS(resetActiveIndex)();
        });

      // Force the gesture to activate immediately along its main axis
      // to prevent parent ScrollViews from stealing the interaction
      if (state.orientation === 'horizontal') {
        pan.activeOffsetX([-1, 1]);
      } else {
        pan.activeOffsetY([-1, 1]);
      }

      return pan;
    }, [
      state.disabled,
      pagePositionToValue,
      closestThumbIndex,
      setValueAtIndex,
      commitValue,
    ]);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return (
      <GestureDetector gesture={gesture}>
        <View
          {...props}
          ref={ref}
          onLayout={handleLayout}
          style={resolvedStyle}
        />
      </GestureDetector>
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
