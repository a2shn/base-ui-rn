import * as React from 'react';
import {
  type NativeSyntheticEvent,
  type TargetedEvent,
  type GestureResponderEvent,
} from 'react-native';
import { useFocus } from '@base-ui-rn/focus-ring';
import { useKeyboardActivation } from '@base-ui-rn/core';
import type { SwitchRootProps, SwitchState, KeyPressEventData } from './types';

/**
 * Manages the state and logic for the Switch primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useSwitchRoot(props: SwitchRootProps) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    readOnly = false,
    focusVisible: forceFocusVisible,
    onPress,
    onKeyPress,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
  } = props;

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);

  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const { focused, focusVisible, onFocus, onBlur } = useFocus({
    focusVisible: forceFocusVisible,
  });

  const toggleState = React.useCallback(() => {
    if (disabled || readOnly) return;
    const newState = !checked;
    if (!isControlled) {
      setUncontrolledChecked(newState);
    }
    onCheckedChange?.(newState);
  }, [checked, disabled, readOnly, isControlled, onCheckedChange]);

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      toggleState();
      onPress?.(event);
    },
    [toggleState, onPress],
  );

  const handleKeyboardActivation = useKeyboardActivation(toggleState, disabled);

  const handleKeyPress = React.useCallback(
    (event: NativeSyntheticEvent<KeyPressEventData>) => {
      handleKeyboardActivation(event);
      onKeyPress?.(event);
    },
    [handleKeyboardActivation, onKeyPress],
  );

  const handleFocus = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onFocus();
      onFocusProp?.(event);
    },
    [onFocus, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onBlur();
      onBlurProp?.(event);
    },
    [onBlur, onBlurProp],
  );

  const state: SwitchState = {
    checked,
    disabled,
    readOnly,
    focused,
    focusVisible,
  };

  return {
    state,
    checked,
    disabled,
    readOnly,
    handlePress,
    handleKeyPress,
    handleFocus,
    handleBlur,
  };
}
