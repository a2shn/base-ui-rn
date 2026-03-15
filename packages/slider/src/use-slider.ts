import * as React from 'react';
import { Platform } from 'react-native';
import { clamp } from '@base-ui-rn/core';
import type { SliderRootProps, SliderState, SliderValue } from './types';
import { calculateNextValues } from './collision';

const normalizeValue = (value: SliderValue | undefined, min: number) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : [min];
  }
  if (typeof value === 'number') {
    return [value];
  }
  return [min];
};

/**
 * Manages the state and logic for the Slider primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useSlider(props: SliderRootProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    onValueCommitted,
    min = 0,
    max = 100,
    step = 1,
    largeStep = 10,
    minStepsBetweenValues = 0,
    stepBetweenValues,
    thumbCollisionBehavior = 'push',
    thumbAlignment = 'center',
    locale,
    format,
    disabled = false,
    orientation = 'horizontal',
  } = props;

  const [trackSize, setTrackSize] = React.useState(0);
  const [thumbSize, setThumbSize] = React.useState(0);

  // Use refs for physical sizes to avoid stale closure issues in rapid updates
  const trackSizeRef = React.useRef(0);
  const thumbSizeRef = React.useRef(0);

  const handleSetTrackSize = React.useCallback((size: number) => {
    trackSizeRef.current = size;
    setTrackSize(size);
  }, []);

  const handleSetThumbSize = React.useCallback((size: number) => {
    thumbSizeRef.current = size;
    setThumbSize(size);
  }, []);

  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<number[]>(() =>
    normalizeValue(defaultValue, min).map((item) => clamp(item, min, max)),
  );

  const current = React.useMemo(
    () =>
      normalizeValue(isControlled ? value : uncontrolled, min).map((item) =>
        clamp(item, min, max),
      ),
    [isControlled, value, uncontrolled, min, max],
  );

  // Critical: Synchronous ref to track current values during rapid dragging
  const currentRef = React.useRef(current);
  currentRef.current = current;

  const emit = React.useCallback(
    (
      next: number[],
      reason: 'drag' | 'track-press' | 'keyboard' | 'none' | 'input-change',
    ) => {
      currentRef.current = next; // Update immediately
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next.length === 1 ? next[0] : next, { reason });
    },
    [isControlled, onValueChange],
  );

  const commitValue = React.useCallback(
    (reason: 'drag' | 'track-press' | 'keyboard' | 'none' | 'input-change') => {
      onValueCommitted?.(currentRef.current.length === 1 ? currentRef.current[0] : currentRef.current, {
        reason,
      });
    },
    [onValueCommitted],
  );

  const setValueAtIndex = React.useCallback(
    (
      index: number,
      rawValue: number,
      reason:
        | 'drag'
        | 'track-press'
        | 'keyboard'
        | 'none'
        | 'input-change' = 'none',
    ) => {
      const snapped = Math.round((rawValue - min) / step) * step + min;
      const precision = step.toString().split('.')[1]?.length || 0;
      const rounded = Number(snapped.toFixed(precision));
      const newValue = clamp(rounded, min, max);

      let minDistance =
        (stepBetweenValues ?? minStepsBetweenValues) * step;

      const isWeb = Platform.OS === 'web';
      const shouldApplyPhysicalDistance =
        thumbAlignment === 'edge' || (thumbAlignment === 'edge-client-only' && !isWeb);

      if (
        shouldApplyPhysicalDistance &&
        trackSizeRef.current > 0 &&
        thumbSizeRef.current > 0
      ) {
        const physicalMinDistance =
          (thumbSizeRef.current / trackSizeRef.current) * (max - min);
        minDistance = Math.max(minDistance, physicalMinDistance);
      }

      if (thumbCollisionBehavior === 'push' && minDistance === 0) {
        minDistance = step;
      }

      const next = calculateNextValues({
        index,
        newValue,
        currentValues: currentRef.current,
        min,
        max,
        minDistance,
        stepBetweenValues:
          stepBetweenValues !== undefined
            ? stepBetweenValues * step
            : undefined,
        behavior: thumbCollisionBehavior,
      });

      if (next.some((v, i) => v !== currentRef.current[i])) {
        const finalNext = next.map((v) => Number(v.toFixed(precision)));
        emit(finalNext, reason);
      }
    },
    [
      min,
      max,
      step,
      minStepsBetweenValues,
      thumbCollisionBehavior,
      thumbAlignment,
      emit,
    ],
  );

  const stepBy = React.useCallback(
    (index: number, delta: number) => {
      setValueAtIndex(index, currentRef.current[index] + delta * step, 'keyboard');
    },
    [step, setValueAtIndex],
  );

  const state: SliderState = {
    value: current,
    min,
    max,
    step,
    disabled,
    orientation,
  };

  return {
    state,
    setValueAtIndex,
    stepBy,
    commitValue,
    locale,
    format,
    largeStep,
    thumbAlignment,
    setTrackSize: handleSetTrackSize,
    setThumbSize: handleSetThumbSize,
  };
}
