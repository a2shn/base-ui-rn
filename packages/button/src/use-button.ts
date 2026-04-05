import { useControllableState } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';

import { ButtonProps } from './types';

export const useButton = (props: ButtonProps) => {
  const {
    defaultPressed = false,
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onPressedChange,
    pressed: controlledPressed,
    tabIndex,
  } = props;

  const isDisabled = disabled === true;

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur: handleBlur,
    onFocus: onRingFocus,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const [pressed = false, setPressed] = useControllableState<boolean>({
    defaultProp: defaultPressed,
    onChange: onPressedChange,
    prop: controlledPressed,
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
    focusRingStyle,
    focusVisible,
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
