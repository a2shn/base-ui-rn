import {
  isActivationAction,
  useActivationDedup,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
} from 'react-native';

import type { ButtonProps } from './types';

export const useButton = (props: ButtonProps) => {
  const {
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onPress,
    tabIndex,
  } = props;

  const isDisabled = disabled === true;

  const {
    focused,
    focusVisible,
    focusRingStyle,
    isFocusable,
    onBlur: handleBlur,
    onFocus: onRingFocus,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const [pressed, setPressed] = React.useState(false);
  const onPressRef = React.useRef(onPress);

  React.useLayoutEffect(() => {
    onPressRef.current = onPress;
  });


  const onCommit = React.useCallback(() => {
    onPressRef.current?.(null as unknown as GestureResponderEvent);
  }, []);

  const {
    handlePress,
    handleKeyboardActivation: handleKeyboardPress,
    handleAccessibilityActivation,
  } = useActivationDedup({
    pressed,
    disabled: isDisabled,
    onCommit,
  });

  const handleKeyboardActivation = useKeyboardActivation(
    handleKeyboardPress,
    isDisabled,
  );

  const handleKeyDown = React.useCallback(
    (e: any) => {
      handleKeyboardActivation(e);
    },
    [handleKeyboardActivation],
  );

  const handleFocus = React.useCallback(
    (e: any) => {
      if (isDisabled && !focusableWhenDisabled) return;
      onRingFocus();
      props.onFocus?.(e);
    },
    [isDisabled, focusableWhenDisabled, onRingFocus, props.onFocus]
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        handleAccessibilityActivation();
      }
    },
    [isDisabled, handleAccessibilityActivation],
  );

  const handlePressIn = React.useCallback((e: any) => {
    if (isDisabled) return;
    setPressed(true);
    props.onPressIn?.(e);
  }, [isDisabled, props.onPressIn]);

  const handlePressOut = React.useCallback((e: any) => {
    if (isDisabled) return;
    setPressed(false);
    props.onPressOut?.(e);
  }, [isDisabled, props.onPressOut]);

  const resolvedTabIndex = resolveTabIndex(isFocusable, tabIndex);

  return {
    focused,
    focusVisible,
    focusRingStyle,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    handlePressIn,
    handlePressOut,
    handleAccessibilityAction,
    isDisabled,
    isFocusable,
    pressed,
    tabIndex: resolvedTabIndex,
  };
};
