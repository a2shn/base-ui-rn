import {
  isActivationAction,
  KeyDownEventData,
  useActivationDedup,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
} from 'react-native';

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
    onPress,
    pressed: controlledPressed,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const actionContext = useToggleGroupActionContext();
  const valueContext = useToggleGroupValueContext();

  const isInGroup = actionContext !== null;
  const isDisabled = disabled || (isInGroup && actionContext.disabled);

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur: handleBlur,
    onFocus: handleFocus,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const [uncontrolledPressed, setUncontrolledPressed] =
    React.useState(defaultPressed);

  let pressed = uncontrolledPressed;
  if (isInGroup && value !== undefined) {
    pressed = valueContext?.valueSet.has(value) ?? false;
  } else if (controlledPressed !== undefined) {
    pressed = controlledPressed;
  }

  const onPressedChangeRef = React.useRef(onPressedChange);
  const onPressRef = React.useRef(onPress); // 2. Track the user's onPress

  React.useLayoutEffect(() => {
    onPressedChangeRef.current = onPressedChange;
    onPressRef.current = onPress; // 3. Keep it fresh
  });

  const onCommit = React.useCallback(
    (nextPressed: boolean) => {
      if (isInGroup && value !== undefined) {
        actionContext?.toggleValue(value);
      } else {
        if (controlledPressed === undefined) {
          setUncontrolledPressed(nextPressed);
        }
        onPressedChangeRef.current?.(nextPressed);
      }

      onPressRef.current?.(null as unknown as GestureResponderEvent);
    },
    [isInGroup, value, actionContext, controlledPressed],
  );

  const {
    handleAccessibilityActivation,
    handleKeyboardActivation: handleKeyboardToggle,
    handlePress,
  } = useActivationDedup({
    disabled: isDisabled,
    onCommit,
    pressed,
  });

  const handleKeyboardActivation = useKeyboardActivation(
    handleKeyboardToggle,
    isDisabled,
  );

  const handleKeyDown = React.useCallback(
    (e: NativeSyntheticEvent<KeyDownEventData>) => {
      handleKeyboardActivation(e);
      if (isInGroup && value !== undefined) {
        actionContext?.onToggleKeyDown(value, e);
      }
    },
    [handleKeyboardActivation, isInGroup, value, actionContext],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        handleAccessibilityActivation();
      }
    },
    [isDisabled, handleAccessibilityActivation],
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

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  return {
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    isFocusable,
    isInGroup,
    registerItem: actionContext?.registerItem,
    registerValue: actionContext?.registerValue,
    state,
    tabIndex,
  };
}
