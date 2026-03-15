import * as React from 'react';
import type { SliderRootProps, SliderState, SliderValue } from './types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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
      let next = [...current];
      const snapped = Math.round((rawValue - min) / step) * step + min;
      // To avoid floating point precision issues like 31.000000000000004
      const precision = step.toString().split('.')[1]?.length || 0;
      const rounded = Number(snapped.toFixed(precision));
      let newValue = clamp(rounded, min, max);

      const minDistance = minStepsBetweenValues * step;

      if (thumbCollisionBehavior === 'none') {
        if (index > 0) {
          newValue = Math.max(newValue, next[index - 1] + minDistance);
        }
        if (index < next.length - 1) {
          newValue = Math.min(newValue, next[index + 1] - minDistance);
        }
        next[index] = newValue;
      } else if (thumbCollisionBehavior === 'push') {
        next[index] = newValue;
        // push left
        for (let i = index - 1; i >= 0; i--) {
          if (next[i + 1] - next[i] < minDistance) {
            next[i] = next[i + 1] - minDistance;
          }
        }
        // push right
        for (let i = index + 1; i < next.length; i++) {
          if (next[i] - next[i - 1] < minDistance) {
            next[i] = next[i - 1] + minDistance;
          }
        }
        next = next.map((v) => clamp(v, min, max));
      } else if (thumbCollisionBehavior === 'swap') {
        next[index] = newValue;
        next.sort((a, b) => a - b);
      }

      if (next.some((v, i) => v !== current[i])) {
        emit(next, reason);
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
  };
}
