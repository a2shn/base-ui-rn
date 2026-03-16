import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import type { KeyPressEventData } from '@base-ui-rn/core';
import type { ToggleGroupChangeEventDetails } from '@base-ui-rn/toggle';
import { useKeyboardNavigation } from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import type { ToggleGroupProps, ToggleGroupState } from './types';

/**
 * Manages the state and logic for the ToggleGroup primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export const useToggleGroup = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  multiple,
  disabled,
  orientation,
  loopFocus,
  onFocusChange,
  focusVisible,
}: {
  value: ToggleGroupProps['value'];
  defaultValue: ToggleGroupProps['defaultValue'];
  onValueChange: ToggleGroupProps['onValueChange'];
  multiple: boolean;
  disabled: boolean;
  orientation: NonNullable<ToggleGroupProps['orientation']>;
  loopFocus: boolean;
  onFocusChange: ToggleGroupProps['onFocusChange'];
  focusVisible: boolean;
}) => {
  const {
    focused,
    focusVisible: isFocusVisible,
    onFocus,
    onBlur,
  } = useFocus({
    focusVisible,
  });

  const { registerItem, handleKeyDown } = useKeyboardNavigation({
    orientation,
    loop: loopFocus,
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

  const onToggleKeyPress = React.useCallback(
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
      value,
      disabled,
      multiple,
      orientation,
      loopFocus,
      focused,
      focusVisible: isFocusVisible,
    }),
    [
      value,
      disabled,
      multiple,
      orientation,
      loopFocus,
      focused,
      isFocusVisible,
    ],
  );

  return {
    onBlur,
    onFocus,
    onToggleKeyPress,
    registerItem,
    registerValue,
    state,
    toggleValue,
    valueSet,
  };
};
