import { useControllableState, useKeyboardNavigation } from '@base-ui-rn/core';
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

  const isDisabled = disabled === true;

  const { handleKeyDown, registerItem } = useKeyboardNavigation({
    loop: loopFocus,
    orientation,
  });

  const [rawStateValue = [], setValue] = useControllableState<string[]>({
    prop: controlledValue,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  });

  // SAFEGUARD: If a single string is accidentally passed instead of an array 
  // (e.g. defaultValue="first"), this prevents the string from being split into characters, 
  // which causes the "first option unselectable" bug.
  const value = Array.isArray(rawStateValue) ? rawStateValue : [rawStateValue];

  const valueSet = React.useMemo(() => new Set(value), [value]);

  // 100% REACTIVE, ZERO REFS. 
  // Reads directly from the live closure, eliminating the first-click race condition.
  const toggleValue = React.useCallback(
    (itemValue: string) => {
      const isAlreadyPressed = valueSet.has(itemValue);
      let nextValue: string[];

      if (multiple) {
        if (isAlreadyPressed) {
          nextValue = value.filter((v) => v !== itemValue);
        } else {
          nextValue = [...value, itemValue];
        }
      } else {
        nextValue = isAlreadyPressed ? [] : [itemValue];
      }

      setValue(nextValue);
    },
    [multiple, value, valueSet, setValue],
  );

  const onToggleKeyDown = React.useCallback(
    (currentValue: string, event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;
      const nextId = handleKeyDown(currentValue, event);
      if (nextId) {
        onFocusChange?.(nextId);
      }
    },
    [isDisabled, handleKeyDown, onFocusChange],
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
      disabled: isDisabled,
      loopFocus,
      multiple,
      orientation,
      value,
    }),
    [value, isDisabled, multiple, orientation, loopFocus],
  );

  return {
    onToggleKeyDown,
    registerItem,
    registerValue,
    state,
    loopFocus,
    multiple,
    isDisabled,
    toggleValue,
    valueSet,
  };
};
