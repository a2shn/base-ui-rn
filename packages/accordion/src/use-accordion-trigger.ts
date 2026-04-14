import { isActivationAction, type KeyDownEventData } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import { useAccordionContext, useAccordionItemContext } from './context';
import type { AccordionTriggerProps, AccordionTriggerState } from './types';

export function useAccordionTrigger(props: AccordionTriggerProps) {
  const {
    disabled: disabledProp,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    tabIndex: tabIndexProp,
  } = props;

  const rootContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const isDisabled =
    disabledProp === true || itemContext.isDisabled || rootContext.isDisabled;

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur: focusOnBlur,
    onFocus: focusOnFocus,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;
      rootContext.onTriggerKeyDown(itemContext.value, event);
    },
    [isDisabled, itemContext.value, rootContext],
  );

  const handlePress = React.useCallback(() => {
    if (isDisabled) return;
    rootContext.toggleItem(itemContext.value, { value: itemContext.value });
  }, [isDisabled, rootContext, itemContext.value]);

  const handleAccessibilityAction = React.useCallback(
    () => (event: { nativeEvent: { actionName: string } }) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        rootContext.toggleItem(itemContext.value, { value: itemContext.value });
      }
    },
    [isDisabled, rootContext, itemContext.value],
  );

  const state: AccordionTriggerState = {
    disabled: isDisabled,
    focused,
    focusVisible,
    open: itemContext.open,
  };

  return {
    focused,
    focusRingStyle,
    focusVisible,
    handleAccessibilityAction,
    handleBlur: focusOnBlur,
    handleFocus: focusOnFocus,
    handleKeyDown,
    handlePress,
    isDisabled,
    isFocusable,
    open: itemContext.open,
    state,
    tabIndex,
  };
}
