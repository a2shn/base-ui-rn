import * as React from 'react';
import {
  type NativeSyntheticEvent,
  type GestureResponderEvent,
  type AccessibilityActionEvent,
  type TargetedEvent,
} from 'react-native';
import {
  mergeAccessibilityActions,
  isActivationAction,
  mergeAccessibilityState,
  resolveTabIndex,
  resolveAriaDisabled,
  resolveAriaPressed,
  resolveDataPressed,
  useKeyboardActivation,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import {
  useKeyboardShortcut,
  getAriaKeyshortcuts,
} from '@base-ui-rn/keyboard-shortcuts';
import type { TogglePressedChangeDetails, ToggleProps } from './types';
import type { ToggleGroupContextValue } from './group-context';

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
    value,
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    disabled,
    onPress,
    onKeyDown,
    accessibilityState,
    accessibilityActions,
    onAccessibilityAction,
    focusableWhenDisabled = false,
    focusVisible: forceFocusVisible = false,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    shortcut,
    tabIndex: tabIndexProp,
    'aria-disabled': ariaDisabledProp,
    'aria-pressed': ariaPressedProp,
    'data-pressed': dataPressedProp,
  } = props;

  const isInGroup = groupContext !== null;

  const isDisabled = disabled === true || (isInGroup && groupContext.disabled);
  const isFocusable = !isDisabled || focusableWhenDisabled === true;

  const {
    focused: isFocused,
    focusVisible: isFocusVisible,
    onFocus: onFocusIn,
    onBlur: onFocusOut,
  } = useFocus({
    focusVisible: forceFocusVisible,
  });

  const [uncontrolledState, setUncontrolledState] =
    React.useState(defaultPressed);

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
      activateToggle('press', event);
    },
    [activateToggle],
  );

  const performKeyboardActivation = React.useCallback(() => {
    activateToggle('keyboard');
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

  const resolvedTabIndex = resolveTabIndex(isFocusable, tabIndexProp);
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
    focusVisible: isFocusVisible,
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
    resolvedTabIndex,
  };
};