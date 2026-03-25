import { useKeyboardActivation } from '@base-ui-rn/core';
import { useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';

import type { KeyPressEventData, SwitchRootProps, SwitchState } from './types';

export function useSwitchRoot(props: SwitchRootProps) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    disableDefaultFocusRing = false,
    disabled = false,
    onBlur: onBlurProp,
    onCheckedChange,
    onFocus: onFocusProp,
    onKeyDown,
    onPress,
    readOnly = false,
  } = props;

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);

  const checked = isControlled ? checkedProp : uncontrolledChecked;
  const isKeyboardActivationRef = React.useRef(false);

  const { focused, focusVisible, focusRingStyle, onBlur, onFocus } =
    useFocusRing({
      disableDefaultFocusRing,
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
      if (isKeyboardActivationRef.current) {
        return;
      }
      toggleState();
      onPress?.(event);
    },
    [toggleState, onPress],
  );

  const performKeyboardActivation = React.useCallback(() => {
    isKeyboardActivationRef.current = true;
    toggleState();

    setTimeout(() => {
      isKeyboardActivationRef.current = false;
    }, 100);
  }, [toggleState]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    disabled,
  );

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyPressEventData>) => {
      handleKeyboardActivation(event);
      onKeyDown?.(event);
    },
    [handleKeyboardActivation, onKeyDown],
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
    focused,
    focusVisible,
    readOnly,
  };

  return {
    checked,
    disabled,
    focusRingStyle,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    readOnly,
    state,
  };
}
