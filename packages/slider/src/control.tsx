import * as React from 'react';
import {
  View,
  PanResponder,
  Platform,
  type LayoutChangeEvent,
} from 'react-native';
import { mergeRefs } from '@base-ui-rn/core';
import { useSliderContext } from './context';
import type { SliderPartProps } from './types';

/**
 * Interactive container that wraps the slider track.
 */
export const SliderControl = React.memo(
  React.forwardRef<View, SliderPartProps>(function SliderControl(
    { style, onLayout, ...props },
    ref,
  ) {
    const { state, setValueAtIndex, commitValue, setTrackSize } =
      useSliderContext();
    const isHorizontal = state.orientation === 'horizontal';
    const isWeb = Platform.OS === 'web';

    const layoutRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 });
    const innerRef = React.useRef<View>(null);
    const mergedRef = React.useMemo(() => mergeRefs(ref, innerRef), [ref]);

    const handleLayout = React.useCallback(
      (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setTrackSize(isHorizontal ? width : height);

        if (!isWeb) {
          (
            event.target as unknown as {
              measureInWindow: (
                cb: (x: number, y: number, width: number, height: number) => void,
              ) => void;
            }
          ).measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              layoutRef.current = { ...layoutRef.current, x, y, width, height };
            },
          );
        }
        onLayout?.(event);
      },
      [isHorizontal, isWeb, setTrackSize, onLayout],
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

    /**
     * Convert absolute coordinates to a slider value.
     */
    const pagePositionToValue = React.useCallback(
      (pageX: number, pageY: number, target: HTMLElement): number => {
        const { min, max } = state;

        if (isWeb) {
          const rect = target.getBoundingClientRect();
          if (isHorizontal) {
            const ratio = rect.width > 0 ? (pageX - rect.left) / rect.width : 0;
            const clamped = Math.min(Math.max(ratio, 0), 1);
            return min + clamped * (max - min);
          } else {
            const ratio =
              rect.height > 0 ? 1 - (pageY - rect.top) / rect.height : 0;
            const clamped = Math.min(Math.max(ratio, 0), 1);
            return min + clamped * (max - min);
          }
        } else {
          const { x, y, width, height } = layoutRef.current;
          if (isHorizontal) {
            const ratio = width > 0 ? (pageX - x) / width : 0;
            const clamped = Math.min(Math.max(ratio, 0), 1);
            return min + clamped * (max - min);
          } else {
            const ratio = height > 0 ? 1 - (pageY - y) / height : 0;
            const clamped = Math.min(Math.max(ratio, 0), 1);
            return min + clamped * (max - min);
          }
        }
      },
      [isHorizontal, isWeb, state.min, state.max],
    );

    // Refs for stable callbacks
    const activeIndexRef = React.useRef(-1);
    const setValueAtIndexRef = React.useRef(setValueAtIndex);
    setValueAtIndexRef.current = setValueAtIndex;
    const commitValueRef = React.useRef(commitValue);
    commitValueRef.current = commitValue;
    const closestThumbIndexRef = React.useRef(closestThumbIndex);
    closestThumbIndexRef.current = closestThumbIndex;
    const pagePositionToValueRef = React.useRef(pagePositionToValue);
    pagePositionToValueRef.current = pagePositionToValue;

    // --- WEB DRAGGING (Pointer API) ---
    React.useEffect(() => {
      if (!isWeb) return;

      const el = (innerRef.current as unknown as HTMLElement) ?? null;
      if (!el) return;

      const onPointerDown = (e: PointerEvent) => {
        if (state.disabled) return;
        e.preventDefault();

        // Capture pointer to handle dragging outside bounds
        if (typeof el.setPointerCapture === 'function') {
          el.setPointerCapture(e.pointerId);
        }

        const rawValue = pagePositionToValueRef.current(
          e.clientX,
          e.clientY,
          el,
        );
        const index = closestThumbIndexRef.current(rawValue);
        activeIndexRef.current = index;
        setValueAtIndexRef.current(index, rawValue, 'drag');
      };

      const onPointerMove = (e: PointerEvent) => {
        if (activeIndexRef.current === -1) return;
        const rawValue = pagePositionToValueRef.current(
          e.clientX,
          e.clientY,
          el,
        );
        setValueAtIndexRef.current(activeIndexRef.current, rawValue, 'drag');
      };

      const onPointerUp = (e: PointerEvent) => {
        if (activeIndexRef.current === -1) return;

        if (typeof el.releasePointerCapture === 'function') {
          el.releasePointerCapture(e.pointerId);
        }

        activeIndexRef.current = -1;
        commitValueRef.current('drag');
      };

      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);

      return () => {
        el.removeEventListener('pointerdown', onPointerDown);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);
        el.removeEventListener('pointercancel', onPointerUp);
      };
    }, [isWeb, state.disabled]);

    // --- NATIVE DRAGGING (PanResponder) ---
    const panResponder = React.useMemo(() => {
      if (isWeb) return null;

      return PanResponder.create({
        onStartShouldSetPanResponder: () => !state.disabled,
        onStartShouldSetPanResponderCapture: () => !state.disabled,
        onMoveShouldSetPanResponder: () => !state.disabled,
        onMoveShouldSetPanResponderCapture: () => !state.disabled,
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: (evt) => {
          const { pageX, pageY, target } = evt.nativeEvent;
          const rawValue = pagePositionToValueRef.current(
            pageX,
            pageY,
            target as never,
          );
          const index = closestThumbIndexRef.current(rawValue);
          activeIndexRef.current = index;
          setValueAtIndexRef.current(index, rawValue, 'drag');
        },

        onPanResponderMove: (evt) => {
          if (activeIndexRef.current === -1) return;
          const { pageX, pageY, target } = evt.nativeEvent;
          const rawValue = pagePositionToValueRef.current(
            pageX,
            pageY,
            target as never,
          );
          setValueAtIndexRef.current(activeIndexRef.current, rawValue, 'drag');
        },

        onPanResponderRelease: () => {
          activeIndexRef.current = -1;
          commitValueRef.current('drag');
        },

        onPanResponderTerminate: () => {
          activeIndexRef.current = -1;
          commitValueRef.current('drag');
        },
      });
    }, [
      isWeb,
      state.disabled,
      activeIndexRef,
      pagePositionToValueRef,
      closestThumbIndexRef,
      setValueAtIndexRef,
      commitValueRef,
    ]);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return (
      <View
        {...props}
        {...(isWeb ? {} : panResponder?.panHandlers)}
        ref={mergedRef}
        onLayout={handleLayout}
        style={[
          isWeb && ({ touchAction: 'none' } as any),
          resolvedStyle,
        ]}
      />
    );
  }),
);

SliderControl.displayName = 'Slider.Control';
