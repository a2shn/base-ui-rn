import {
  isActivationAction,
  type KeyPressEventData,
  mergeAccessibilityActions,
  mergeAccessibilityState,
  resolveAriaDisabled,
  resolveAriaPressed,
  resolveDataPressed,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import {
  getAriaKeyshortcuts,
  useKeyboardShortcut,
} from '@base-ui-rn/keyboard-shortcuts';
import * as React from 'react';
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';

import type { ToggleGroupContextValue } from './group-context';
import type { TogglePressedChangeDetails, ToggleProps } from './types';

/**
 * Manages the state and logic for the Toggle primitive.
 * @param props The initialization properties.
 * @param groupContext The context from a parent ToggleGroup, if present.
 * @returns State and event handlers for the component.
 */
export const useToggle = (
  props: ToggleProps,
  groupContext: ToggleGroupContextValue | null,
) => {
  const {
    accessibilityActions,
    accessibilityState,
    'aria-disabled': ariaDisabledProp,
    'aria-pressed': ariaPressedProp,
    'data-pressed': dataPressedProp,
    defaultPressed = false,
    disabled,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onAccessibilityAction,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown,
    onPress,
    onPressedChange,
    pressed: controlledPressed,
    shortcut,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const isInGroup = groupContext !== null;

  const isDisabled = disabled === true || (isInGroup && groupContext.disabled);

  const {
    focused: isFocused,
    focusRingStyle,
    isFocusable,
    onBlur: onFocusOut,
    onFocus: onFocusIn,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(
    isFocusable,
    tabIndexProp as 0 | -1 | undefined,
  );

  const [uncontrolledState, setUncontrolledState] =
    React.useState(defaultPressed);

  const isKeyboardActivationRef = React.useRef(false);

  const isPressed =
    isInGroup && value !== undefined
      ? groupContext.valueSet.has(value)
      : controlledPressed !== undefined
        ? controlledPressed
        : uncontrolledState;

  const dispatchChange = React.useCallback(
    (next: boolean, details: TogglePressedChangeDetails) => {
      if (isInGroup && value !== undefined) {
        groupContext.toggleValue(value, { ...details, value });
      } else {
        if (controlledPressed === undefined) {
          setUncontrolledState(next);
        }
        onPressedChange?.(next, details);
      }
    },
    [isInGroup, value, groupContext, controlledPressed, onPressedChange],
  );

  const activateToggle = React.useCallback(
    (
      source: TogglePressedChangeDetails['source'],
      nativeEvent: GestureResponderEvent | null = null,
    ) => {
      dispatchChange(!isPressed, { source });
      if (nativeEvent !== null && source === 'press') {
        onPress?.(nativeEvent);
      }
    },
    [isPressed, dispatchChange, onPress],
  );

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (isKeyboardActivationRef.current) {
        return;
      }
      activateToggle('press', event);
    },
    [activateToggle],
  );

  const performKeyboardActivation = React.useCallback(() => {
    isKeyboardActivationRef.current = true;
    activateToggle('keyboard');
    setTimeout(() => {
      isKeyboardActivationRef.current = false;
    }, 200);
  }, [activateToggle]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    isDisabled,
  );

  useKeyboardShortcut(shortcut, () => {
    if (!isDisabled) {
      performKeyboardActivation();
    }
  });

  const handleKeyDown = React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData>) => {
      const nativeEvent = e.nativeEvent;
      const key = nativeEvent?.key;
      if (key === 'Enter' || key === ' ') {
        e.stopPropagation?.();
      }
      handleKeyboardActivation(e);
      onKeyDown?.(e);
      if (isInGroup && value !== undefined) {
        groupContext.onToggleKeyDown(value, e);
      }
    },
    [handleKeyboardActivation, onKeyDown, isInGroup, value, groupContext],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      const { actionName } = event.nativeEvent;

      if (isActivationAction(actionName)) {
        activateToggle('accessibilityAction');
      }

      onAccessibilityAction?.(event);
    },
    [activateToggle, onAccessibilityAction],
  );

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onFocusIn();
      onFocusProp?.(e);
    },
    [onFocusIn, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onFocusOut();
      onBlurProp?.(e);
    },
    [onFocusOut, onBlurProp],
  );

  const mergedAccessibilityState = React.useMemo(
    () =>
      mergeAccessibilityState(
        accessibilityState as Record<string, unknown> | undefined,
        isDisabled,
        isPressed,
      ),
    [accessibilityState, isDisabled, isPressed],
  );

  const mergedAccessibilityActions = React.useMemo(
    () => mergeAccessibilityActions(accessibilityActions),
    [accessibilityActions],
  );

  const resolvedAriaDisabled = resolveAriaDisabled(
    isDisabled,
    ariaDisabledProp,
  );
  const resolvedAriaKeyshortcuts = React.useMemo(
    () => getAriaKeyshortcuts(shortcut),
    [shortcut],
  );
  const resolvedAriaPressed = resolveAriaPressed(isPressed, ariaPressedProp);
  const resolvedDataPressed = resolveDataPressed(isPressed, dataPressedProp);

  return {
    focused: isFocused,
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    isDisabled,
    isFocusable,
    isInGroup,
    isPressed,
    mergedAccessibilityActions,
    mergedAccessibilityState,
    resolvedAriaDisabled,
    resolvedAriaKeyshortcuts,
    resolvedAriaPressed,
    resolvedDataPressed,
    tabIndex,
  };
};
