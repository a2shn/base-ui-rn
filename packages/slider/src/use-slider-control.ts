import * as React from 'react';
import {
  Platform,
  PanResponder,
  type LayoutChangeEvent,
  type View,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { useSliderContext } from './context';
import { evaluateStyles } from '@base-ui-rn/core';
import type { SliderPartProps } from './types';

export interface SliderControlOptions extends Pick<SliderPartProps, 'style'> {
  /**
   * Callback for layout changes.
   */
  onLayout?: (event: LayoutChangeEvent) => void;
}

export interface SliderControlPanHandlers {
  onStartShouldSetResponder: () => boolean;
  onMoveShouldSetResponder: () => boolean;
  onResponderGrant: (e: GestureResponderEvent) => void;
  onResponderMove: (e: GestureResponderEvent) => void;
  onResponderRelease: (e: GestureResponderEvent) => void;
  onResponderTerminate: (e: GestureResponderEvent) => void;
  onResponderTerminationRequest: () => boolean;
}

export interface SliderControlReturn {
  ref: React.RefObject<View | null>;
  refInternal: React.RefObject<View | null>;
  mergedRef: React.RefCallback<View>;
  panHandlers: SliderControlPanHandlers;
  handleLayout: (event: LayoutChangeEvent) => void;
  resolvedStyle: ViewStyle | ViewStyle[] | undefined;
}

function pagePositionToValue(
  pageX: number,
  pageY: number,
  target: HTMLElement | View,
  layoutRef: React.MutableRefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
  isHorizontal: boolean,
  isWeb: boolean,
  min: number,
  max: number,
): number {
  if (isWeb) {
    const el = target as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (isHorizontal) {
      const ratio = rect.width > 0 ? (pageX - rect.left) / rect.width : 0;
      const clamped = Math.min(Math.max(ratio, 0), 1);
      return min + clamped * (max - min);
    } else {
      const ratio = rect.height > 0 ? 1 - (pageY - rect.top) / rect.height : 0;
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
}

function closestThumbIndex(rawValue: number, values: number[]): number {
  if (values.length === 1) return 0;
  let closest = 0;
  let minDist = Infinity;
  values.forEach((v, i) => {
    const d = Math.abs(v - rawValue);
    if (d < minDist) {
      minDist = d;
      closest = i;
    }
  });
  return closest;
}

/**
 * Manages the state and logic for the SliderControl component.
 * @param options Configuration options for the slider control.
 * @returns State and event handlers for the control component.
 */
export function useSliderControl(options: SliderControlOptions = {}) {
  const { onLayout, style } = options;

  const {
    state,
    setValueAtIndex,
    commitValue,
    setTrackSize,
    thumbNodeHandles,
  } = useSliderContext();

  const isHorizontal = state.orientation === 'horizontal';
  const isWeb = Platform.OS === 'web';

  const layoutRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 });
  const innerRef = React.useRef<View>(null);

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

  // Stable refs for callbacks
  const activeIndexRef = React.useRef(-1);
  const setValueAtIndexRef = React.useRef(setValueAtIndex);
  setValueAtIndexRef.current = setValueAtIndex;
  const commitValueRef = React.useRef(commitValue);
  commitValueRef.current = commitValue;

  // --- WEB DRAGGING (Pointer API) ---
  React.useEffect(() => {
    if (!isWeb) return;

    const el = (innerRef.current as unknown as HTMLElement) ?? null;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (state.disabled) return;
      e.preventDefault();

      if (typeof el.setPointerCapture === 'function') {
        el.setPointerCapture(e.pointerId);
      }

      const rawValue = pagePositionToValue(
        e.clientX,
        e.clientY,
        el,
        layoutRef,
        isHorizontal,
        isWeb,
        state.min,
        state.max,
      );
      const index = closestThumbIndex(rawValue, state.value);
      activeIndexRef.current = index;
      setValueAtIndexRef.current(index, rawValue, 'drag');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activeIndexRef.current === -1) return;
      const rawValue = pagePositionToValue(
        e.clientX,
        e.clientY,
        el,
        layoutRef,
        isHorizontal,
        isWeb,
        state.min,
        state.max,
      );
      setValueAtIndexRef.current(activeIndexRef.current, rawValue, 'drag');
    };

    const onPointerUp = () => {
      if (activeIndexRef.current === -1) return;

      if (typeof el.releasePointerCapture === 'function') {
        el.releasePointerCapture(
          (innerRef.current as unknown as PointerEvent).pointerId,
        );
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
  }, [isWeb, state.disabled, state.min, state.max, isHorizontal]);

  // --- NATIVE DRAGGING (PanResponder) ---
  const panResponder = React.useMemo(() => {
    if (isWeb) return null;

    return PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      onStartShouldSetPanResponder: (evt) => {
        if (state.disabled) return false;
        const nativeTarget = evt.nativeEvent.target as unknown as number;
        const isTouchOnThumb = thumbNodeHandles.current.some(
          (handle) => typeof handle === 'number' && handle === nativeTarget,
        );
        return !isTouchOnThumb;
      },
      onMoveShouldSetPanResponder: () => !state.disabled,

      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (evt) => {
        const { pageX, pageY, target } = evt.nativeEvent;
        const rawValue = pagePositionToValue(
          pageX,
          pageY,
          target as unknown as View,
          layoutRef,
          isHorizontal,
          isWeb,
          state.min,
          state.max,
        );
        const index = closestThumbIndex(rawValue, state.value);
        activeIndexRef.current = index;
        setValueAtIndexRef.current(index, rawValue, 'drag');
      },

      onPanResponderMove: (evt) => {
        if (activeIndexRef.current === -1) return;
        const { pageX, pageY, target } = evt.nativeEvent;
        const rawValue = pagePositionToValue(
          pageX,
          pageY,
          target as unknown as View,
          layoutRef,
          isHorizontal,
          isWeb,
          state.min,
          state.max,
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
    state.min,
    state.max,
    state.value,
    isHorizontal,
    thumbNodeHandles,
    commitValueRef,
    setValueAtIndexRef,
  ]);

  const mergedRef = React.useCallback((node: View | null) => {
    innerRef.current = node;
  }, []);

  const resolvedStyle = React.useMemo(
    () => evaluateStyles(style, state),
    [style, state],
  );

  return {
    ref: innerRef,
    refInternal: innerRef,
    mergedRef,
    panHandlers: (panResponder?.panHandlers ?? {}) as SliderControlPanHandlers,
    handleLayout,
    resolvedStyle,
  };
}
