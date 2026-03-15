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
    min = 0,
    max = 100,
    step = 1,
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
    (next: number[]) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next.length === 1 ? next[0] : next);
    },
    [isControlled, onValueChange],
  );

  const setValueAtIndex = React.useCallback(
    (index: number, rawValue: number) => {
      const next = [...current];
      next[index] = clamp(rawValue, min, max);
      emit(next);
    },
    [current, min, max, emit],
  );

  const stepBy = React.useCallback(
    (index: number, delta: number) => {
      setValueAtIndex(index, current[index] + delta * step);
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
  };
}
