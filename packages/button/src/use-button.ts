import { useFocusRing, resolveTabIndex } from '@base-ui-rn/focus-ring';
import { useControllableState } from '@base-ui-rn/core';
import * as React from 'react';
import { ButtonProps } from './types';

export const useButton = (props: ButtonProps) => {
  const {
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    tabIndex,
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
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

  const [pressed = false, setPressed] = useControllableState<boolean>({
    prop: controlledPressed,
    defaultProp: defaultPressed,
    onChange: onPressedChange,
  });

  const handlePressIn = React.useCallback(() => {
    if (isDisabled) return;
    setPressed(true);
  }, [isDisabled, setPressed]);

  const handlePressOut = React.useCallback(() => {
    if (isDisabled) return;
    setPressed(false);
  }, [isDisabled, setPressed]);

  const handleFocus = React.useCallback(() => {
    if (isDisabled && !focusableWhenDisabled) return;
    onRingFocus();
  }, [isDisabled, focusableWhenDisabled, onRingFocus]);

  return {
    focused,
    focusVisible,
    focusRingStyle,
    handleBlur,
    handleFocus,
    handlePressIn,
    handlePressOut,
    isDisabled,
    isFocusable,
    pressed,
    tabIndex: resolveTabIndex(isFocusable, tabIndex),
  };
};
