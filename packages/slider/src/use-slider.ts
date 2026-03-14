import * as React from 'react';
import {
  type LayoutChangeEvent,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { SliderRootProps, SliderState, KeyPressEventData } from './types';

/**
 * Manages the state and logic for the Slider primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useSliderRoot(props: SliderRootProps) {
  const {
    value: controlledValue,
    defaultValue,
    onValueChange,
    onValueCommitted,
    min = 0,
    max = 100,
    step = 1,
    orientation = 'horizontal',
    disabled = false,
    thumbCollisionBehavior = 'push',
  } = props;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValues, setUncontrolledValues] = React.useState<number[]>(
    () => {
      const initial = defaultValue ?? controlledValue ?? min;
      return Array.isArray(initial) ? initial : [initial];
    },
  );

  const values = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : uncontrolledValues;

  const [draggingIndex, setDraggingIndex] = React.useState(-1);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });

  const percentages = React.useMemo(() => {
    return values.map((v) => ((v - min) / (max - min)) * 100);
  }, [values, min, max]);

  const snapToStep = React.useCallback(
    (val: number) => {
      const snapped = Math.round((val - min) / step) * step + min;
      return Math.max(min, Math.min(max, snapped));
    },
    [min, max, step],
  );

  const updateValue = React.useCallback(
    (index: number, newVal: number) => {
      if (disabled) return;
      const snapped = snapToStep(newVal);

      const nextValues = [...values];
      nextValues[index] = snapped;

      // Handle collisions
      if (thumbCollisionBehavior === 'none') {
        if (index > 0 && nextValues[index] < nextValues[index - 1]) {
          nextValues[index] = nextValues[index - 1];
        }
        if (
          index < nextValues.length - 1 &&
          nextValues[index] > nextValues[index + 1]
        ) {
          nextValues[index] = nextValues[index + 1];
        }
      } else if (thumbCollisionBehavior === 'push') {
        // Basic push logic: if moving right, push subsequent
        if (index > 0 && nextValues[index] < nextValues[index - 1]) {
          for (let i = index - 1; i >= 0; i--) {
            if (nextValues[i + 1] < nextValues[i])
              nextValues[i] = nextValues[i + 1];
          }
        }
        if (
          index < nextValues.length - 1 &&
          nextValues[index] > nextValues[index + 1]
        ) {
          for (let i = index + 1; i < nextValues.length; i++) {
            if (nextValues[i - 1] > nextValues[i])
              nextValues[i] = nextValues[i - 1];
          }
        }
      } else if (thumbCollisionBehavior === 'swap') {
        nextValues.sort((a, b) => a - b);
      }

      if (!isControlled) {
        setUncontrolledValues(nextValues);
      }
      onValueChange?.(nextValues.length === 1 ? nextValues[0] : nextValues);
    },
    [
      values,
      min,
      max,
      step,
      disabled,
      thumbCollisionBehavior,
      isControlled,
      onValueChange,
      snapToStep,
    ],
  );

  const getValueFromCoordinate = React.useCallback(
    (x: number, y: number) => {
      const isHorizontal = orientation === 'horizontal';
      const size = isHorizontal ? layout.width : layout.height;
      const pos = isHorizontal ? x : layout.height - y;
      const ratio = Math.max(0, Math.min(1, pos / size));
      return min + ratio * (max - min);
    },
    [layout, min, max, orientation],
  );

  const onLayout = React.useCallback((e: LayoutChangeEvent) => {
    setLayout({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }, []);

  const handlePointerDown = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;
      const { locationX, locationY } = event.nativeEvent;
      const newVal = getValueFromCoordinate(locationX, locationY);

      // Find closest thumb
      let closestIndex = 0;
      let minDiff = Math.abs(values[0] - newVal);
      for (let i = 1; i < values.length; i++) {
        const diff = Math.abs(values[i] - newVal);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }

      setDraggingIndex(closestIndex);
      updateValue(closestIndex, newVal);
    },
    [disabled, getValueFromCoordinate, values, updateValue],
  );

  const handlePointerMove = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || draggingIndex === -1) return;
      const { locationX, locationY } = event.nativeEvent;
      const newVal = getValueFromCoordinate(locationX, locationY);
      updateValue(draggingIndex, newVal);
    },
    [disabled, draggingIndex, getValueFromCoordinate, updateValue],
  );

  const handlePointerUp = React.useCallback(() => {
    if (draggingIndex !== -1) {
      onValueCommitted?.(values.length === 1 ? values[0] : values);
      setDraggingIndex(-1);
    }
  }, [draggingIndex, values, onValueCommitted]);

  const handleKeyDown = React.useCallback(
    (index: number, event: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;
      const key = event.nativeEvent.key;
      const currentVal = values[index];
      const largeStepVal = props.largeStep ?? 10;
      let nextVal = currentVal;

      switch (key) {
        case 'ArrowRight':
        case 'ArrowUp':
          nextVal = currentVal + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          nextVal = currentVal - step;
          break;
        case 'PageUp':
          nextVal = currentVal + largeStepVal;
          break;
        case 'PageDown':
          nextVal = currentVal - largeStepVal;
          break;
        case 'Home':
          nextVal = min;
          break;
        case 'End':
          nextVal = max;
          break;
        default:
          return;
      }

      if (nextVal !== currentVal) {
        if (event.preventDefault) event.preventDefault();
        updateValue(index, nextVal);
      }
    },
    [disabled, values, props.largeStep, step, min, max, updateValue],
  );

  const labelId = React.useId();

  const state: SliderState = {
    values,
    percentages,
    draggingIndex,
    focusedIndex,
    orientation,
    disabled,
    min,
    max,
    labelId,
  };

  return {
    state,
    onLayout,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    setThumbValue: updateValue,
    onThumbFocus: (idx: number) => setFocusedIndex(idx),
    onThumbBlur: () => setFocusedIndex(-1),
  };
}
