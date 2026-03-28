import {
  isActivationAction,
  type KeyPressEventData,
  mergeAccessibilityActions,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type NativeSyntheticEvent,
  Platform,
  type TargetedEvent,
} from 'react-native';

import type {
  RadioGroupContextValue,
  RadioRootProps,
  RadioRootState,
} from './types';

/**
 * Manages the state and logic for the Radio.Root primitive.
 * @param props The initialization properties.
 * @param groupContext The context provided by a parent RadioGroup.
 * @returns State and event handlers for the Radio.Root component.
 */
export function useRadioRoot(
  props: RadioRootProps,
  groupContext: RadioGroupContextValue | null,
) {
  const {
    accessibilityActions,
    disabled: disabledProp = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onAccessibilityAction,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    onPress: onPressProp,
    readOnly: readOnlyProp = false,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const isDisabled = disabledProp || (groupContext?.disabled ?? false);
  const isReadOnly = readOnlyProp || (groupContext?.readOnly ?? false);
  const checked = groupContext ? groupContext.value === value : false;

  const isInGroup = groupContext !== null;
  const hasActiveItem = groupContext?.value !== undefined;

  const {
    focused,
    focusRingStyle,
    isFocusable,
    onBlur: onFocusOut,
    onFocus: onFocusIn,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = React.useMemo(() => {
    if (tabIndexProp !== undefined) {
      return tabIndexProp;
    }
    if (Platform.OS !== 'web') {
      return undefined;
    }
    if (isInGroup) {
      return resolveTabIndex(isFocusable, undefined, {
        hasActiveItem,
        isActive: checked,
      });
    }
    return isFocusable ? 0 : -1;
  }, [tabIndexProp, isInGroup, isFocusable, hasActiveItem, checked]);

  const select = React.useCallback(() => {
    if (isDisabled || isReadOnly) return;
    groupContext?.onValueChange(value);
  }, [isDisabled, isReadOnly, groupContext, value]);

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      select();
      onPressProp?.(event);
    },
    [select, onPressProp],
  );

  const performKeyboardActivation = React.useCallback(() => {
    select();
    onPressProp?.(null as unknown as GestureResponderEvent);
  }, [select, onPressProp]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    isDisabled,
  );

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyPressEventData>) => {
      handleKeyboardActivation(event);
      onKeyDownProp?.(event);
      if (groupContext && value !== undefined) {
        groupContext.onRadioKeyDown(value, event);
      }
    },
    [handleKeyboardActivation, onKeyDownProp, groupContext, value],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: AccessibilityActionEvent) => {
      const { actionName } = event.nativeEvent;
      if (isActivationAction(actionName)) {
        select();
      }
      onAccessibilityAction?.(event);
    },
    [select, onAccessibilityAction],
  );

  const handleFocus = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onFocusIn();
      onFocusProp?.(event);
    },
    [onFocusIn, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onFocusOut();
      onBlurProp?.(event);
    },
    [onFocusOut, onBlurProp],
  );

  const mergedAccessibilityActions = React.useMemo(
    () => mergeAccessibilityActions(accessibilityActions),
    [accessibilityActions],
  );

  const state: RadioRootState = {
    checked,
    disabled: isDisabled,
    focused,
    readOnly: isReadOnly,
  };

  return {
    checked,
    disabled: isDisabled,
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    isFocusable,
    mergedAccessibilityActions,
    readOnly: isReadOnly,
    state,
    tabIndex,
  };
}
