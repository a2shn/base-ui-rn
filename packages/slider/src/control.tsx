import * as React from 'react';
import { View, PanResponder, type LayoutChangeEvent } from 'react-native';
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
    const { state, setValueAtIndex, commitValue, setTrackSize } =
      useSliderContext();
    const isHorizontal = state.orientation === 'horizontal';

    // Cache layout so we can compute values from gesture positions
    const layoutRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 });

    const handleLayout = React.useCallback(
      (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setTrackSize(isHorizontal ? width : height);

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
      (pageX: number, pageY: number, target?: any): number => {
        let { x, y, width, height } = layoutRef.current;

        // Fallback for Web if layout hasn't been measured via onLayout yet
        if (
          width === 0 &&
          target &&
          typeof target.getBoundingClientRect === 'function'
        ) {
          const rect = target.getBoundingClientRect();
          const win = typeof window !== 'undefined' ? (window as any) : null;
          x = rect.left + (win?.scrollX ?? 0);
          y = rect.top + (win?.scrollY ?? 0);
          width = rect.width;
          height = rect.height;
        }


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

    const panResponder = React.useMemo(() => {
      return PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: () => !state.disabled,
        onStartShouldSetPanResponderCapture: () => !state.disabled,
        onMoveShouldSetPanResponder: () => !state.disabled,
        onMoveShouldSetPanResponderCapture: () => !state.disabled,

        // CRITICAL: Once we have the gesture, DO NOT let ScrollView or anything else steal it!
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: (evt) => {
          const { pageX, pageY, target } = evt.nativeEvent;
          const rawValue = pagePositionToValue(pageX, pageY, target as never);
          const index = closestThumbIndex(rawValue);
          activeIndexRef.current = index;
          setValueAtIndex(index, rawValue, 'drag');
        },

        onPanResponderMove: (evt) => {
          if (activeIndexRef.current === -1) return;
          const { pageX, pageY, target } = evt.nativeEvent;
          const rawValue = pagePositionToValue(pageX, pageY, target as never);
          setValueAtIndex(activeIndexRef.current, rawValue, 'drag');
        },

        onPanResponderRelease: () => {
          activeIndexRef.current = -1;
          commitValue('drag');
        },

        onPanResponderTerminate: () => {
          activeIndexRef.current = -1;
          commitValue('drag');
        },
      });
    }, [
      state.disabled,
      pagePositionToValue,
      closestThumbIndex,
      setValueAtIndex,
      commitValue,
    ]);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return (
      <View
        {...props}
        {...panResponder.panHandlers}
        ref={ref}
        onLayout={handleLayout}
        // @ts-expect-error onPointerDown is Web only
        onPointerDown={(e: React.PointerEvent) => {
          if (state.disabled) return;
          // Only handle direct clicks on the control/track that aren't already handled by thumbs
          if (e.target !== e.currentTarget) return;

          const rawValue = pagePositionToValue(
            e.pageX,
            e.pageY,
            e.currentTarget as never,
          );
          const index = closestThumbIndex(rawValue);
          setValueAtIndex(index, rawValue, 'track-press');
          commitValue('track-press');
        }}
        style={resolvedStyle}
      />
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
