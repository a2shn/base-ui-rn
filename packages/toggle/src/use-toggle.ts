import {
  isActivationAction,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type {
  AccessibilityActionEvent,
  GestureResponderEvent,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';

import { useToggleGroupContext } from './group-context';
import type { ToggleProps, ToggleState } from './types';

export function useToggle(props: ToggleProps) {
  const {
    defaultPressed = false,
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onBlur,
    onFocus,
    onKeyDown,
    onPress,
    onPressedChange,
    pressed: controlledPressed,
    value,
  } = props;

  const groupContext = useToggleGroupContext();
  const isInGroup = groupContext !== null;

  const isDisabled = disabled || (isInGroup && groupContext.disabled);

  const {
    focused,
    focusRingStyle,
    isFocusable,
    onBlur: onFocusOut,
    onFocus: onFocusIn,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const [uncontrolledPressed, setUncontrolledPressed] = React.useState(defaultPressed);

  const pressed = isInGroup && value !== undefined
    ? groupContext.valueSet.has(value)
    : controlledPressed !== undefined
      ? controlledPressed
      : uncontrolledPressed;

  const onPressedChangeRef = React.useRef(onPressedChange);
  const onPressRef = React.useRef(onPress);
  const onKeyDownRef = React.useRef(onKeyDown);

  React.useLayoutEffect(() => {
    onPressedChangeRef.current = onPressedChange;
    onPressRef.current = onPress;
    onKeyDownRef.current = onKeyDown;
  });

  const handleToggle = React.useCallback(
    (source: 'press' | 'keyboard' | 'accessibilityAction') => {
      const nextPressed = !pressed;
      if (isInGroup && value !== undefined) {
        groupContext.toggleValue(value, { value });
      } else {
        if (controlledPressed === undefined) {
          setUncontrolledPressed(nextPressed);
        }
        onPressedChangeRef.current?.(nextPressed);
      }
    },
    [pressed, isInGroup, value, groupContext, controlledPressed],
  );

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled) return;
      handleToggle('press');
      onPressRef.current?.(event);
    },
    [isDisabled, handleToggle],
  );

  const activateToggle = React.useCallback(() => {
    if (isDisabled) return;
    handleToggle('keyboard');
  }, [isDisabled, handleToggle]);

  const handleKeyboardActivation = useKeyboardActivation(activateToggle, isDisabled);

  const handleKeyDown = React.useCallback(
    (e: any) => {
      handleKeyboardActivation(e);
      onKeyDownRef.current?.(e);
      if (isInGroup && value !== undefined) {
        groupContext.onToggleKeyDown(value, e);
      }
    },
    [handleKeyboardActivation, isInGroup, value, groupContext],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (isDisabled) return;
      if (isActivationAction(event.nativeEvent.actionName)) {
        handleToggle('accessibilityAction');
      }
    },
    [isDisabled, handleToggle],
  );

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onFocusIn();
      onFocus?.(e);
    },
    [onFocusIn, onFocus],
  );

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onFocusOut();
      onBlur?.(e);
    },
    [onFocusOut, onBlur],
  );

  const tabIndex = resolveTabIndex(isFocusable, props.tabIndex as any);

  const state: ToggleState = {
    pressed,
    focused,
    disabled: isDisabled,
  };

  return {
    state,
    isFocusable,
    focusRingStyle,
    handlePress,
    handleKeyDown,
    handleAccessibilityAction,
    handleFocus,
    handleBlur,
    tabIndex,
    isInGroup,
  };
}
