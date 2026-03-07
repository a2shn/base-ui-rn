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

export const useToggle = ({
  value,
  controlledPressed,
  defaultPressed,
  onPressedChange,
  disabled,
  onPress,
  onKeyPress,
  accessibilityState,
  accessibilityActions,
  onAccessibilityAction,
  focusableWhenDisabled,
  forceFocusVisible,
  onFocusProp,
  onBlurProp,
  shortcut,
  tabIndexProp,
  ariaDisabledProp,
  ariaPressedProp,
  dataPressedProp,
  groupContext,
}: {
  value: ToggleProps['value'];
  controlledPressed: ToggleProps['pressed'];
  defaultPressed: boolean;
  onPressedChange: ToggleProps['onPressedChange'];
  disabled: ToggleProps['disabled'];
  onPress: ToggleProps['onPress'];
  onKeyPress: ToggleProps['onKeyPress'];
  accessibilityState: ToggleProps['accessibilityState'];
  accessibilityActions: ToggleProps['accessibilityActions'];
  onAccessibilityAction: ToggleProps['onAccessibilityAction'];
  focusableWhenDisabled: boolean;
  forceFocusVisible: boolean;
  onFocusProp: ToggleProps['onFocus'];
  onBlurProp: ToggleProps['onBlur'];
  shortcut: ToggleProps['shortcut'];
  tabIndexProp: ToggleProps['tabIndex'];
  ariaDisabledProp: ToggleProps['aria-disabled'];
  ariaPressedProp: ToggleProps['aria-pressed'];
  dataPressedProp: ToggleProps['data-pressed'];
  groupContext: ToggleGroupContextValue | null;
}) => {
  const isInGroup = groupContext !== null;

  const isDisabled = disabled === true || (isInGroup && groupContext.disabled);
  const isFocusable = !isDisabled || focusableWhenDisabled === true;

  const { focused, focusVisible, onFocus, onBlur } = useFocus({
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

  const handleKeyPress = React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData>) => {
      handleKeyboardActivation(e);
      onKeyPress?.(e);
    },
    [handleKeyboardActivation, onKeyPress],
  );

  const handleKeyDown = React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData>) => {
      if (isInGroup && value !== undefined) {
        groupContext.onToggleKeyPress(value, e);
      }
    },
    [isInGroup, value, groupContext],
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
    focused,
    focusVisible,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handleKeyPress,
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
