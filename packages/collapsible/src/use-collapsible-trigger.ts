import { isActivationAction } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';

import { useCollapsibleContext } from './context';
import type { CollapsibleTriggerProps, CollapsibleTriggerState } from './types';

export function useCollapsibleTrigger(props: CollapsibleTriggerProps) {
  const {
    disabled: disabledProp,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    tabIndex: tabIndexProp,
  } = props;

  const context = useCollapsibleContext();
  const isDisabled = disabledProp === true || context.disabled;

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
    if (isDisabled) return;
    context.toggle();
  }, [isDisabled, context]);

  const handleAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        context.toggle();
      }
    },
    [isDisabled, context],
  );

  const state: CollapsibleTriggerState = {
    disabled: isDisabled,
    focused,
    focusVisible,
    open: context.open,
  };

  return {
    focused,
    focusRingStyle,
    focusVisible,
    handleAccessibilityAction,
    handleBlur: onBlur,
    handleFocus: onFocus,
    handlePress,
    isDisabled,
    isFocusable,
    open: context.open,
    state,
    tabIndex,
  };
}
