import { useKeyboardNavigation } from '@base-ui-rn/core';
import type { KeyDownEventData } from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import type { ToggleGroupProps, ToggleGroupState } from './types';

export const useToggleGroup = (props: ToggleGroupProps) => {
  const {
    defaultValue,
    disabled = false,
    loopFocus = true,
    multiple = false,
    onFocusChange,
    onValueChange,
    orientation = 'horizontal',
    value: controlledValue,
  } = props;

  const { handleKeyDown, registerItem } = useKeyboardNavigation({
    loop: loopFocus,
    orientation,
  });

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? []);

  const value = controlledValue ?? uncontrolledValue;
  const valueSet = React.useMemo(() => new Set(value), [value]);

  const valueRef = React.useRef(value);
  const valueSetRef = React.useRef(valueSet);
  const onValueChangeRef = React.useRef(onValueChange);
  const onFocusChangeRef = React.useRef(onFocusChange);

  React.useLayoutEffect(() => {
    valueRef.current = value;
    valueSetRef.current = valueSet;
    onValueChangeRef.current = onValueChange;
    onFocusChangeRef.current = onFocusChange;
  });

  const toggleValue = React.useCallback(
    (itemValue: string) => {
      const currentValues = valueRef.current;
      const isAlreadyPressed = valueSetRef.current.has(itemValue);

      let nextValue: string[];

      if (multiple) {
        if (isAlreadyPressed) {
          nextValue = currentValues.filter((v) => v !== itemValue);
        } else {
          nextValue = [...currentValues, itemValue];
        }
      } else {
        nextValue = isAlreadyPressed ? [] : [itemValue];
      }

      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue);
      }

      onValueChangeRef.current?.(nextValue);
    },
    [multiple, controlledValue],
  );

  const onToggleKeyDown = React.useCallback(
    (currentValue: string, event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (disabled) return;
      const nextId = handleKeyDown(currentValue, event);
      if (nextId) {
        onFocusChangeRef.current?.(nextId);
      }
    },
    [disabled, handleKeyDown],
  );

  const registeredValues = React.useRef<Set<string>>(new Set());
  const registerValue = React.useCallback((itemValue: string) => {
    if (__DEV__) {
      if (registeredValues.current.has(itemValue)) {
        console.warn(
          `[ToggleGroup] Duplicate value "${itemValue}" detected. Each Toggle within a ToggleGroup must have a unique value.`,
        );
      }
    }

    registeredValues.current.add(itemValue);

    return () => {
      registeredValues.current.delete(itemValue);
    };
  }, []);

  const state: ToggleGroupState = React.useMemo(
    () => ({
      disabled,
      loopFocus,
      multiple,
      orientation,
      value,
    }),
    [value, disabled, multiple, orientation, loopFocus],
  );

  return {
    onToggleKeyDown,
    registerItem,
    registerValue,
    state,
    toggleValue,
    valueSet,
  };
};
