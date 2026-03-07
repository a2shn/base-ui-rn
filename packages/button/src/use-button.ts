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
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import {
  useKeyboardShortcut,
  getAriaKeyshortcuts,
} from '@base-ui-rn/keyboard-shortcuts';
import type {
  ButtonPressedChangeDetails,
  ButtonProps,
  KeyPressEventData,
} from './types';

export const useButton = ({
  disabled,
  focusableWhenDisabled,
  focusVisible,
  accessibilityState,
  accessibilityActions,
  onPressedChange,
  onPress,
  onAccessibilityAction,
  onKeyPress,
  onFocusProp,
  onBlurProp,
  shortcut,
  tabIndex,
  ariaDisabled,
}: {
  disabled: ButtonProps['disabled'];
  focusableWhenDisabled: boolean;
  focusVisible: boolean;
  accessibilityState: ButtonProps['accessibilityState'];
  accessibilityActions: ButtonProps['accessibilityActions'];
  onPressedChange: ButtonProps['onPressedChange'];
  onPress: ButtonProps['onPress'];
  onAccessibilityAction: ButtonProps['onAccessibilityAction'];
  onKeyPress: ButtonProps['onKeyPress'];
  onFocusProp: ButtonProps['onFocus'];
  onBlurProp: ButtonProps['onBlur'];
  shortcut: ButtonProps['shortcut'];
  tabIndex: ButtonProps['tabIndex'];
  ariaDisabled: ButtonProps['aria-disabled'];
}) => {
  const isDisabled = disabled === true;
  const isFocusable = !isDisabled || focusableWhenDisabled === true;

  const {
    focused,
    focusVisible: isFocusVisible,
    onFocus,
    onBlur,
  } = useFocus({
    focusVisible,
  });

  const mergedAccessibilityState = React.useMemo(
    () =>
      mergeAccessibilityState(
        accessibilityState as Record<string, unknown> | undefined,
        isDisabled,
      ),
    [accessibilityState, isDisabled],
  );

  const resolvedTabIndex = resolveTabIndex(isFocusable, tabIndex);
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

  const handleKeyPress = React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData>) => {
      handleKeyboardActivation(e);
      onKeyPress?.(e);
    },
    [handleKeyboardActivation, onKeyPress],
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
      onFocus();
      onFocusProp?.(e);
    },
    [onFocus, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onBlur();
      onBlurProp?.(e);
    },
    [onBlur, onBlurProp],
  );

  return {
    focused,
    focusVisible: isFocusVisible,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyPress,
    handlePress,
    isFocusable,
    mergedAccessibilityActions,
    mergedAccessibilityState,
    resolvedAriaDisabled,
    resolvedAriaKeyshortcuts,
    resolvedTabIndex,
  };
};
