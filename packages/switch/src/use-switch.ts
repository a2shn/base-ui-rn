import { isActivationAction, useControllableState } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';

import type { SwitchRootProps, SwitchState } from './types';

export function useSwitchRoot(props: SwitchRootProps) {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onCheckedChange,
    readOnly = false,
    tabIndex: tabIndexProp,
  } = props;

  const [checked = false, setChecked] = useControllableState<boolean>({
    defaultProp: defaultChecked,
    onChange: (nextChecked: boolean) => onCheckedChange?.(nextChecked),
    prop: controlledChecked,
  });

  const isDisabled = disabled === true;

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur,
    onFocus,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  const handlePress = React.useCallback(() => {
    if (isDisabled || readOnly) return;
    setChecked((prev) => !prev);
  }, [isDisabled, readOnly, setChecked]);

  const handleKeyDown = React.useCallback(
    (event: { nativeEvent: { key: string } }) => {
      const { key } = event.nativeEvent;
      if (key === ' ' || key === 'Spacebar') {
        handlePress();
      }
    },
    [handlePress],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (
        isActivationAction(event.nativeEvent.actionName) &&
        !isDisabled &&
        !readOnly
      ) {
        setChecked((prev) => !prev);
      }
    },
    [isDisabled, readOnly, setChecked],
  );

  const state: SwitchState = React.useMemo(
    () => ({
      checked,
      disabled: isDisabled,
      focused,
      focusVisible,
      readOnly,
    }),
    [checked, isDisabled, focused, focusVisible, readOnly],
  );

  return {
    checked,
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur: onBlur,
    handleFocus: onFocus,
    handleKeyDown,
    handlePress,
    isDisabled,
    isFocusable,
    readOnly,
    state,
    tabIndex,
  };
}
