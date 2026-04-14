import {
  isActivationAction,
  type KeyDownEventData,
  useControllableState,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import {
  useToggleGroupActionContext,
  useToggleGroupValueContext,
} from './group-context';
import type { ToggleProps, ToggleState } from './types';

export function useToggle(props: ToggleProps) {
  const {
    defaultPressed = false,
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onPressedChange,
    pressed: controlledPressed,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const actionContext = useToggleGroupActionContext();
  const valueContext = useToggleGroupValueContext();

  const isInGroup = actionContext !== null;
  const isDisabled = disabled === true || (isInGroup && actionContext.disabled);

  const [internalPressed = false, setInternalPressed] =
    useControllableState<boolean>({
      defaultProp: defaultPressed,
      onChange: onPressedChange,
      prop: controlledPressed,
    });

  const pressed =
    isInGroup && value !== undefined
      ? (valueContext?.valueSet.has(value) ?? false)
      : internalPressed;

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

  const tabIndex = resolveTabIndex(
    isFocusable,
    tabIndexProp as 0 | -1 | undefined,
  );

  const toggle = React.useCallback(() => {
    if (isDisabled) return;

    if (isInGroup && value !== undefined) {
      actionContext.toggleValue(value);
    } else {
      setInternalPressed(!pressed);
    }
  }, [
    isDisabled,
    isInGroup,
    value,
    actionContext,
    pressed,
    setInternalPressed,
  ]);

  const handlePress = React.useCallback(() => {
    toggle();
  }, [toggle]);

  const handleAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (isActivationAction(event.nativeEvent?.actionName) && !isDisabled) {
        toggle();
      }
    },
    [isDisabled, toggle],
  );

  const handleKeyDown = React.useCallback(
    (e: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;

      if (isInGroup && value !== undefined) {
        actionContext?.onToggleKeyDown(value, e);
      }
    },
    [isDisabled, isInGroup, value, actionContext],
  );

  const state: ToggleState = React.useMemo(
    () => ({
      disabled: isDisabled,
      focused,
      focusVisible,
      pressed,
    }),
    [isDisabled, focused, focusVisible, pressed],
  );

  return {
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur: onBlur,
    handleFocus: onFocus,
    handleKeyDown,
    handlePress,
    isDisabled,
    isFocusable,
    isInGroup,
    registerItem: actionContext?.registerItem,
    registerValue: actionContext?.registerValue,
    state,
    tabIndex,
  };
}
