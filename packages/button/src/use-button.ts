import { isActivationAction, useKeyboardActivation } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';

import type { ButtonProps, KeyPressEventData } from './types';
import { useButtonA11y } from './use-button-a11y';

export const useButton = (props: ButtonProps) => {
  const {
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onAccessibilityAction,
    onBlur,
    onFocus,
    onKeyDown,
    onPress,
    onPressIn,
    onPressOut,
    tabIndex: tabIndexProp,
  } = props;

  const isDisabled = disabled === true;

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

  const [pressed, setPressed] = React.useState(false);

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  const a11yProps = useButtonA11y({
    isDisabled,
    isFocusable,
    pressed,
    props,
  });

  const onPressRef = React.useRef(onPress);
  React.useLayoutEffect(() => {
    onPressRef.current = onPress;
  });

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (!isDisabled) onPressRef.current?.(event);
    },
    [isDisabled],
  );

  const handlePressIn = React.useCallback(
    (event: GestureResponderEvent) => {
      if (!isDisabled) setPressed(true);
      onPressIn?.(event);
    },
    [isDisabled, onPressIn],
  );

  const handlePressOut = React.useCallback(
    (event: GestureResponderEvent) => {
      if (!isDisabled) setPressed(false);
      onPressOut?.(event);
    },
    [isDisabled, onPressOut],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        onPressRef.current?.(null as unknown as GestureResponderEvent);
      }
      onAccessibilityAction?.(event);
    },
    [isDisabled, onAccessibilityAction],
  );

  const performKeyboardActivation = React.useCallback(() => {
    if (!isDisabled) {
      onPressRef.current?.(null as unknown as GestureResponderEvent);
    }
  }, [isDisabled]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    isDisabled,
  );

  const handleKeyDown = React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData>) => {
      handleKeyboardActivation(e);
      onKeyDown?.(e);
    },
    [handleKeyboardActivation, onKeyDown],
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

  return {
    a11yProps,
    focused,
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    handlePressIn,
    handlePressOut,
    isFocusable,
    pressed,
    tabIndex,
  };
};
