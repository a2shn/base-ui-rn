import * as React from 'react';
import { PanResponder, type View } from 'react-native';

import type { SliderState } from './types';

export interface SliderGesturesOptions {
  state: SliderState;
  setValueAtIndex: (index: number, value: number, reason: 'drag') => void;
  focusThumb: (index: number) => void;
  commitValue: (reason: 'drag') => void;
  setDragging: (dragging: boolean) => void;
  isHorizontal: boolean;
  isWeb: boolean;
  layoutRef: React.MutableRefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  containerRef: React.RefObject<View | null>;
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
    const { height, width, x, y } = layoutRef.current;
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

export function useSliderGestures(options: SliderGesturesOptions) {
  const {
    commitValue,
    containerRef,
    focusThumb,
    isHorizontal,
    isWeb,
    layoutRef,
    setDragging,
    setValueAtIndex,
    state,
  } = options;

  const activeIndexRef = React.useRef(-1);
  const pointerIdRef = React.useRef<number | null>(null);

  // Stable refs for reactive values to prevent re-creating handlers
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const setValueAtIndexRef = React.useRef(setValueAtIndex);
  setValueAtIndexRef.current = setValueAtIndex;
  const focusThumbRef = React.useRef(focusThumb);
  focusThumbRef.current = focusThumb;
  const commitValueRef = React.useRef(commitValue);
  commitValueRef.current = commitValue;
  const setDraggingRef = React.useRef(setDragging);
  setDraggingRef.current = setDragging;

  // --- WEB DRAGGING (Pointer API) ---
  React.useEffect(() => {
    if (!isWeb) return;

    const el = (containerRef.current as unknown as HTMLElement) ?? null;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const { disabled, max, min, value } = stateRef.current;
      if (disabled) return;

      e.preventDefault();

      const rawValue = pagePositionToValue(
        e.clientX,
        e.clientY,
        el,
        layoutRef,
        isHorizontal,
        isWeb,
        min,
        max,
      );
      const index = closestThumbIndex(rawValue, value);

      focusThumbRef.current(index);
      setDraggingRef.current(true);

      if (typeof el.setPointerCapture === 'function') {
        el.setPointerCapture(e.pointerId);
        pointerIdRef.current = e.pointerId;
      }

      activeIndexRef.current = index;
      setValueAtIndexRef.current(index, rawValue, 'drag');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activeIndexRef.current === -1) return;
      const { max, min } = stateRef.current;
      const rawValue = pagePositionToValue(
        e.clientX,
        e.clientY,
        el,
        layoutRef,
        isHorizontal,
        isWeb,
        min,
        max,
      );
      setValueAtIndexRef.current(activeIndexRef.current, rawValue, 'drag');
    };

    const onPointerUp = (e?: PointerEvent) => {
      if (activeIndexRef.current === -1) return;

      if (pointerIdRef.current !== null) {
        try {
          el.releasePointerCapture(pointerIdRef.current);
        } catch {
          // Pointer may already be released or was never captured
        }
        pointerIdRef.current = null;
      }

      activeIndexRef.current = -1;
      setDraggingRef.current(false);
      commitValueRef.current('drag');
    };

    const onLostPointerCapture = () => {
      onPointerUp();
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('lostpointercapture', onLostPointerCapture);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('lostpointercapture', onLostPointerCapture);
    };
  }, [isHorizontal, isWeb, containerRef, layoutRef]);

  // --- NATIVE DRAGGING (PanResponder) ---
  const panResponder = React.useMemo(() => {
    if (isWeb) return null;

    return PanResponder.create({
      onMoveShouldSetPanResponder: () => !stateRef.current.disabled,
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: (evt) => {
        const { max, min, value } = stateRef.current;
        const { pageX, pageY, target } = evt.nativeEvent;
        const rawValue = pagePositionToValue(
          pageX,
          pageY,
          target as unknown as View,
          layoutRef,
          isHorizontal,
          isWeb,
          min,
          max,
        );
        const index = closestThumbIndex(rawValue, value);

        focusThumbRef.current(index);
        setDraggingRef.current(true);

        activeIndexRef.current = index;
        setValueAtIndexRef.current(index, rawValue, 'drag');
      },
      onPanResponderMove: (evt) => {
        if (activeIndexRef.current === -1) return;
        const { max, min } = stateRef.current;
        const { pageX, pageY, target } = evt.nativeEvent;
        const rawValue = pagePositionToValue(
          pageX,
          pageY,
          target as unknown as View,
          layoutRef,
          isHorizontal,
          isWeb,
          min,
          max,
        );
        setValueAtIndexRef.current(activeIndexRef.current, rawValue, 'drag');
      },

      onPanResponderRelease: () => {
        activeIndexRef.current = -1;
        setDraggingRef.current(false);
        commitValueRef.current('drag');
      },
      onPanResponderTerminate: () => {
        activeIndexRef.current = -1;
        setDraggingRef.current(false);
        commitValueRef.current('drag');
      },

      onPanResponderTerminationRequest: () => false,

      onStartShouldSetPanResponder: () => !stateRef.current.disabled,

      onStartShouldSetPanResponderCapture: () => false,
    });
  }, [isHorizontal, isWeb, layoutRef]);

  return {
    panHandlers: panResponder?.panHandlers ?? {},
  };
}
