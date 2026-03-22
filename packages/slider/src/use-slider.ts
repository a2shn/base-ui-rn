import { clamp } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, type View } from 'react-native';

import { calculateNextValues } from './collision';
import type { SliderRootProps, SliderState, SliderValue } from './types';

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
    defaultValue,
    disabled = false,
    format,
    largeStep = 10,
    locale,
    max = 100,
    maxStepsBetweenValues = 0,
    min = 0,
    minStepsBetweenValues = 0,
    onValueChange,
    onValueCommitted,
    orientation = 'horizontal',
    step = 1,
    stepBetweenValues,
    thumbAlignment = 'center',
    thumbCollisionBehavior = 'push',
    value,
  } = props;

  // Use refs for physical sizes to avoid stale closure issues in rapid updates
  const trackSizeRef = React.useRef(0);
  const thumbSizeRef = React.useRef(0);
  const thumbRefs = React.useRef<(View | null)[]>([]);
  const thumbNodeHandles = React.useRef<Array<number | undefined>>([]);

  const handleSetTrackSize = React.useCallback((size: number) => {
    trackSizeRef.current = size;
  }, []);

  const handleSetThumbSize = React.useCallback((size: number) => {
    thumbSizeRef.current = size;
  }, []);

  const [focusedThumbIndex, setFocusedThumbIndex] = React.useState<
    number | null
  >(null);

  const [dragging, setDragging] = React.useState(false);

  const formatter = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, format);
    } catch {
      return null;
    }
  }, [locale, format]);

  const focusThumb = React.useCallback((index: number) => {
    setFocusedThumbIndex(index);
    const thumb = thumbRefs.current[index];
    if (thumb) {
      if (Platform.OS === 'web') {
        (thumb as unknown as HTMLElement).focus();
      }
    }
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

  // Stable refs for callback props to avoid re-creating handlers
  const onValueChangeRef = React.useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const onValueCommittedRef = React.useRef(onValueCommitted);
  onValueCommittedRef.current = onValueCommitted;

  const emit = React.useCallback(
    (
      next: number[],
      reason: 'drag' | 'track-press' | 'keyboard' | 'none' | 'input-change',
    ) => {
      currentRef.current = next; // Update immediately
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChangeRef.current?.(next.length === 1 ? next[0] : next, {
        reason,
      });
    },
    [isControlled],
  );

  const commitValue = React.useCallback(
    (reason: 'drag' | 'track-press' | 'keyboard' | 'none' | 'input-change') => {
      onValueCommittedRef.current?.(
        currentRef.current.length === 1
          ? currentRef.current[0]
          : currentRef.current,
        {
          reason,
        },
      );
    },
    [],
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

      let minDistance = (stepBetweenValues ?? minStepsBetweenValues) * step;

      const isWeb = Platform.OS === 'web';
      const shouldApplyPhysicalDistance =
        thumbAlignment === 'edge' ||
        (thumbAlignment === 'edge-client-only' && !isWeb);

      if (
        shouldApplyPhysicalDistance &&
        trackSizeRef.current > 0 &&
        thumbSizeRef.current > 0
      ) {
        const physicalMinDistance =
          (thumbSizeRef.current / trackSizeRef.current) * (max - min);
        minDistance = Math.max(minDistance, physicalMinDistance);
      }

      // Calculate max distance in steps, then convert to value units
      let maxDistanceInValueUnits: number | undefined;
      if (maxStepsBetweenValues !== undefined && maxStepsBetweenValues > 0) {
        maxDistanceInValueUnits = maxStepsBetweenValues * step;
      }

      const next = calculateNextValues({
        behavior: thumbCollisionBehavior,
        currentValues: currentRef.current,
        index,
        max,
        maxDistance: maxDistanceInValueUnits,
        min,
        minDistance,
        newValue,
        stepBetweenValues:
          stepBetweenValues !== undefined
            ? stepBetweenValues * step
            : undefined,
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
      stepBetweenValues,
      thumbCollisionBehavior,
      thumbAlignment,
      emit,
    ],
  );

  const stepBy = React.useCallback(
    (index: number, delta: number) => {
      setValueAtIndex(
        index,
        currentRef.current[index] + delta * step,
        'keyboard',
      );
    },
    [step, setValueAtIndex],
  );

  const state: SliderState = React.useMemo(
    () => ({
      activeIndex: focusedThumbIndex,
      disabled,
      dragging,
      max,
      maxStepsBetweenValues,
      min,
      minStepsBetweenValues,
      orientation,
      step,
      value: current,
    }),
    [
      current,
      min,
      max,
      step,
      disabled,
      dragging,
      orientation,
      minStepsBetweenValues,
      maxStepsBetweenValues,
      focusedThumbIndex,
    ],
  );

  return React.useMemo(
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
      setThumbSize: handleSetThumbSize,
      setTrackSize: handleSetTrackSize,
      setValueAtIndex,
      state,
      stepBy,
      thumbAlignment,
      thumbNodeHandles,
      thumbRefs,
    }),
    [
      commitValue,
      focusedThumbIndex,
      focusThumb,
      formatter,
      format,
      largeStep,
      locale,
      setDragging,
      handleSetThumbSize,
      handleSetTrackSize,
      setValueAtIndex,
      state,
      stepBy,
      thumbAlignment,
    ],
  );
}
