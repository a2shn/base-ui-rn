import type { KeyPressEventData } from '@base-ui-rn/core';
import { useKeyboardNavigation } from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import type { ToggleGroupChangeEventDetails } from '@base-ui-rn/toggle';
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

  const {
    focused: isFocused,
    focusVisible: isFocusVisible,
    onBlur: onFocusOut,
    onFocus: onFocusIn,
  } = useFocus({});

  const { handleKeyDown, registerItem } = useKeyboardNavigation({
    loop: loopFocus,
    orientation,
  });

  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? [],
  );

  const value = controlledValue ?? uncontrolledValue;
  const valueSet = React.useMemo(() => new Set(value), [value]);

  const toggleValue = React.useCallback(
    (itemValue: string, details: ToggleGroupChangeEventDetails) => {
      const nextValue = multiple
        ? valueSet.has(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue]
        : valueSet.has(itemValue)
          ? []
          : [itemValue];

      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue, details);
    },
    [multiple, valueSet, value, controlledValue, onValueChange],
  );

  const onToggleKeyDown = React.useCallback(
    (currentValue: string, event: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;
      const nextId = handleKeyDown(currentValue, event);
      if (nextId) {
        onFocusChange?.(nextId);
      }
    },
    [disabled, handleKeyDown, onFocusChange],
  );

  const registeredValues = React.useRef<Set<string>>(new Set());
  const registerValue = React.useCallback((itemValue: string) => {
    if (process.env.NODE_ENV !== 'production') {
      if (registeredValues.current.has(itemValue)) {
        console.warn(
          `ToggleGroup: Duplicate value "${itemValue}" detected. Each Toggle within a ToggleGroup must have a unique value.`,
        );
      }
      registeredValues.current.add(itemValue);
    }

    return () => {
      if (process.env.NODE_ENV !== 'production') {
        registeredValues.current.delete(itemValue);
      }
    };
  }, []);

  const state: ToggleGroupState = React.useMemo(
    () => ({
      disabled,
      focused: isFocused,
      focusVisible: isFocusVisible,
      loopFocus,
      multiple,
      orientation,
      value,
    }),
    [
      value,
      disabled,
      multiple,
      orientation,
      loopFocus,
      isFocused,
      isFocusVisible,
    ],
  );

  return {
    onBlur: onFocusOut,
    onFocus: onFocusIn,
    onToggleKeyDown,
    registerItem,
    registerValue,
    state,
    toggleValue,
    valueSet,
  };
};
