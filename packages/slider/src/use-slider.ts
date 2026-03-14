import * as React from 'react';
import {
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  PanResponder,
  AccessibilityInfo,
  Platform,
  type View,
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
    thumbAlignment = 'center',
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

  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const [draggingIndex, setDraggingIndex] = React.useState(-1);
  const draggingIndexRef = React.useRef(-1);

  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [layout, setLayout] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const layoutRef = React.useRef(layout);
  layoutRef.current = layout;

  const [thumbSize, setThumbSize] = React.useState(0);
  const thumbSizeRef = React.useRef(thumbSize);
  thumbSizeRef.current = thumbSize;

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

      if (valuesRef.current[index] === snapped) return;

      const nextValues = [...valuesRef.current];
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

      const finalValue = nextValues.length === 1 ? nextValues[0] : nextValues;
      onValueChange?.(finalValue);

      if (Platform.OS !== 'web') {
        AccessibilityInfo.announceForAccessibility(
          `Slider value: ${finalValue}`,
        );
      }
    },
    [disabled, thumbCollisionBehavior, isControlled, onValueChange, snapToStep],
  );

  const updateValueRef = React.useRef(updateValue);
  updateValueRef.current = updateValue;

  const getValueFromPageCoordinate = React.useCallback(
    (pageX: number, pageY: number) => {
      const isHorizontal = orientation === 'horizontal';
      const size = isHorizontal
        ? layoutRef.current.width
        : layoutRef.current.height;
      const offset = isHorizontal ? layoutRef.current.x : layoutRef.current.y;

      let pos = isHorizontal
        ? pageX - offset
        : layoutRef.current.height - (pageY - offset);

      if (thumbAlignment === 'edge' && thumbSizeRef.current > 0) {
        const halfThumb = thumbSizeRef.current / 2;
        pos = Math.max(halfThumb, Math.min(size - halfThumb, pos));
        const effectiveSize = size - thumbSizeRef.current;
        const ratio = Math.max(
          0,
          Math.min(1, (pos - halfThumb) / effectiveSize),
        );
        return min + ratio * (max - min);
      }

      const ratio = Math.max(0, Math.min(1, pos / size));
      return min + ratio * (max - min);
    },
    [min, max, orientation, thumbAlignment],
  );

  const getValueFromPageCoordinateRef = React.useRef(
    getValueFromPageCoordinate,
  );
  getValueFromPageCoordinateRef.current = getValueFromPageCoordinate;

  const findClosestIndex = React.useCallback((val: number) => {
    let closestIndex = 0;
    let minDiff = Math.abs(valuesRef.current[0] - val);
    for (let i = 1; i < valuesRef.current.length; i++) {
      const diff = Math.abs(valuesRef.current[i] - val);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }, []);

  const findClosestIndexRef = React.useRef(findClosestIndex);
  findClosestIndexRef.current = findClosestIndex;

  const controlRef = React.useRef<View | null>(null);

  const onLayout = React.useCallback(() => {
    if (controlRef.current) {
      controlRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setLayout({ width, height, x: pageX, y: pageY });
      });
    }
  }, []);

  const onThumbLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setThumbSize(orientation === 'horizontal' ? width : height);
    },
    [orientation],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onStartShouldSetPanResponderCapture: () => !disabled,
        onPanResponderGrant: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          const newVal = getValueFromPageCoordinateRef.current(pageX, pageY);
          const index = findClosestIndexRef.current(newVal);
          draggingIndexRef.current = index;
          setDraggingIndex(index);
          updateValueRef.current(index, newVal);
        },
        onPanResponderMove: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          const newVal = getValueFromPageCoordinateRef.current(pageX, pageY);
          if (draggingIndexRef.current !== -1) {
            updateValueRef.current(draggingIndexRef.current, newVal);
          }
        },
        onPanResponderRelease: () => {
          if (draggingIndexRef.current !== -1) {
            onValueCommitted?.(
              valuesRef.current.length === 1
                ? valuesRef.current[0]
                : valuesRef.current,
            );
          }
          draggingIndexRef.current = -1;
          setDraggingIndex(-1);
        },
      }),
    [disabled, onValueCommitted],
  );

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
    onThumbLayout,
    panHandlers: panResponder.panHandlers,
    handleKeyDown,
    setThumbValue: updateValue,
    onThumbFocus: (idx: number) => setFocusedIndex(idx),
    onThumbBlur: () => setFocusedIndex(-1),
    thumbAlignment,
    thumbSize,
    controlRef,
  };
}
