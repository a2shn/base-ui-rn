import * as React from 'react';
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
    thumbCollisionBehavior = 'push',
    thumbAlignment = 'center',
    locale,
    format,
    disabled = false,
    orientation = 'horizontal',
  } = props;

  const [trackSize, setTrackSize] = React.useState(0);
  const [thumbSize, setThumbSize] = React.useState(0);

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

  const emit = React.useCallback(
    (
      next: number[],
      reason: 'drag' | 'track-press' | 'keyboard' | 'none' | 'input-change',
    ) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next.length === 1 ? next[0] : next, { reason });
    },
    [isControlled, onValueChange],
  );

  const commitValue = React.useCallback(
    (reason: 'drag' | 'track-press' | 'keyboard' | 'none' | 'input-change') => {
      onValueCommitted?.(current.length === 1 ? current[0] : current, {
        reason,
      });
    },
    [current, onValueCommitted],
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
      // To avoid floating point precision issues like 31.000000000000004
      const precision = step.toString().split('.')[1]?.length || 0;
      const rounded = Number(snapped.toFixed(precision));
      const newValue = clamp(rounded, min, max);

      let minDistance = minStepsBetweenValues * step;

      // When using 'edge' alignment, we want to prevent thumbs from overlapping
      // visually by ensuring their values are separated by at least their physical width.
      if (thumbAlignment === 'edge' && trackSize > 0 && thumbSize > 0) {
        const physicalMinDistance = (thumbSize / trackSize) * (max - min);
        minDistance = Math.max(minDistance, physicalMinDistance);
      }

      if (thumbCollisionBehavior === 'push' && minDistance === 0) {
        minDistance = step;
      }

      const next = calculateNextValues({
        index,
        newValue,
        currentValues: current,
        min,
        max,
        minDistance,
        behavior: thumbCollisionBehavior,
      });

      if (next.some((v, i) => v !== current[i])) {
        // Final precision rounding for all values before emitting
        const finalNext = next.map((v) => Number(v.toFixed(precision)));
        emit(finalNext, reason);
      }
    },
    [
      current,
      min,
      max,
      step,
      minStepsBetweenValues,
      thumbCollisionBehavior,
      emit,
    ],
  );

  const stepBy = React.useCallback(
    (index: number, delta: number) => {
      setValueAtIndex(index, current[index] + delta * step, 'keyboard');
    },
    [current, setValueAtIndex, step],
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
    setTrackSize,
    setThumbSize,
  };
}
