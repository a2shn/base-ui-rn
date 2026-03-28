import {
  isActivationAction,
  mergeAccessibilityActions,
  mergeAccessibilityState,
  resolveAriaDisabled,
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

import type {
  ButtonPressedChangeDetails,
  ButtonProps,
  KeyPressEventData,
} from './types';

/**
 * Manages the state and logic for the Button primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export const useButton = (props: ButtonProps) => {
  const {
    accessibilityActions,
    accessibilityState,
    'aria-disabled': ariaDisabled,
    disabled = false,
    focusableWhenDisabled = false,
    onAccessibilityAction,
    onBlur,
    onFocus,
    onKeyDown,
    onPress,
    onPressedChange,
    shortcut,
    tabIndex: tabIndexProp,
  } = props;

  const isDisabled = disabled === true;

  const {
    focused: isFocused,
    focusRingStyle,
    isFocusable,
    onBlur: onFocusOut,
    onFocus: onFocusIn,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing: props.disableDefaultFocusRing ?? false,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  const mergedAccessibilityState = React.useMemo(
    () =>
      mergeAccessibilityState(
        accessibilityState as Record<string, unknown> | undefined,
        isDisabled,
      ),
    [accessibilityState, isDisabled],
  );

  const resolvedAriaDisabled = resolveAriaDisabled(isDisabled, ariaDisabled);
  const resolvedAriaKeyshortcuts = React.useMemo(
    () => getAriaKeyshortcuts(shortcut),
    [shortcut],
  );

  const mergedAccessibilityActions = React.useMemo(
    () => mergeAccessibilityActions(accessibilityActions),
    [accessibilityActions],
  );

  const activateButton = React.useCallback(
    (
      source: ButtonPressedChangeDetails['source'],
      nativeEvent: GestureResponderEvent | null = null,
    ) => {
      onPressedChange?.({ source });
      if (source === 'press' || !onPressedChange) {
        onPress?.(nativeEvent as GestureResponderEvent);
      }
    },
    [onPressedChange, onPress],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      const actionName = event.nativeEvent.actionName;
      if (isActivationAction(actionName) && !isDisabled) {
        activateButton('accessibilityAction');
      }

      onAccessibilityAction?.(event);
    },
    [isDisabled, activateButton, onAccessibilityAction],
  );

  const performKeyboardActivation = React.useCallback(() => {
    activateButton('keyboard');
  }, [activateButton]);

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
    },
    [handleKeyboardActivation, onKeyDown],
  );

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (!isDisabled) {
        activateButton('press', event);
      }
    },
    [activateButton, isDisabled],
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
    focused: isFocused,
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    isFocusable,
    mergedAccessibilityActions,
    mergedAccessibilityState,
    resolvedAriaDisabled,
    resolvedAriaKeyshortcuts,
    tabIndex,
  };
};
