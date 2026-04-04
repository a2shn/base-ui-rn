import {
  isActivationAction,
  useActivationDedup,
  useKeyboardActivation,
  type KeyDownEventData,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';

import type { SwitchRootProps, SwitchState } from './types';

export function useSwitchRoot(props: SwitchRootProps) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onBlur: onBlurProp,
    onCheckedChange,
    onFocus: onFocusProp,
    onKeyDown,
    onPress,
    readOnly = false,
    tabIndex: tabIndexProp,
  } = props;

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);

  const checked = isControlled ? checkedProp : uncontrolledChecked;
  const isDisabled = disabled;

  const { focused, focusVisible, focusRingStyle, isFocusable, onBlur, onFocus } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp as 0 | -1 | undefined);

  const onCommit = React.useCallback(() => {
    if (isDisabled || readOnly) return;
    const newState = !checked;
    if (!isControlled) {
      setUncontrolledChecked(newState);
    }
    onCheckedChange?.(newState);
  }, [checked, isDisabled, readOnly, isControlled, onCheckedChange]);

  const {
    handlePress: dedupHandlePress,
    handleKeyboardActivation: handleKeyboardToggle,
    handleAccessibilityActivation,
  } = useActivationDedup({
    disabled: isDisabled || readOnly,
    onCommit,
    pressed: checked,
  });

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      dedupHandlePress(event);
      onPress?.(event);
    },
    [dedupHandlePress, onPress],
  );

  const handleKeyboardActivation = useKeyboardActivation(handleKeyboardToggle, isDisabled || readOnly);

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled || readOnly) return;
      handleKeyboardActivation(event);
      onKeyDown?.(event);
    },
    [isDisabled, readOnly, handleKeyboardActivation, onKeyDown],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: any) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled && !readOnly) {
        handleAccessibilityActivation();
      }
    },
    [isDisabled, readOnly, handleAccessibilityActivation],
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
    isDisabled,
    focused,
    focusVisible,
    readOnly,
  };

  return {
    checked,
    isDisabled,
    focusRingStyle,
    handleBlur: handleBlur,
    handleFocus: handleFocus,
    handleKeyDown: handleKeyDown,
    handlePress: handlePress,
    handleAccessibilityAction,
    isFocusable,
    readOnly,
    state,
    tabIndex,
  };
}
