import { isActivationAction, type KeyDownEventData } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

import { useTabsContext } from './context';
import type { TabProps, TabState } from './types';

export function useTab(props: TabProps) {
  const {
    disabled: disabledProp = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const context = useTabsContext();

  const ref = React.useRef<View>(null);

  const isDisabled = disabledProp;

  React.useLayoutEffect(() => {
    return context.registerTab(value, ref);
  }, [value, context]);

  const {
    focused,
    focusVisible,
    focusRingStyle,
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
  const isFocusedFromRoot = context.focusedValue === value;
  const active = context.value === value;

  const handleFocus = React.useCallback(() => {
    onFocus();
    context.setFocusedValue(value);
    context.onFocusChange?.(String(value));
  }, [onFocus, context, value]);

  const handlePress = React.useCallback(() => {
    if (isDisabled) return;
    context.onValueChange(value);
  }, [isDisabled, context, value]);

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;
      context.onTabKeyDown(value, event);
    },
    [isDisabled, context, value],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: any) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        context.onValueChange(value);
      }
    },
    [isDisabled, context, value],
  );

  const handleOnLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      context.updateTabMeasurement(value, e.nativeEvent.layout);
    },
    [context, value],
  );

  const state: TabState = {
    activationDirection: context.activationDirection,
    active,
    isDisabled,
    focused: focused || isFocusedFromRoot,
    focusVisible,
    orientation: context.orientation,
  };

  return {
    isDisabled,
    focusRingStyle,
    handleBlur: onBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    handleAccessibilityAction,
    isFocusable,
    handleOnLayout,
    ref,
    state,
    tabIndex,
  };
}
