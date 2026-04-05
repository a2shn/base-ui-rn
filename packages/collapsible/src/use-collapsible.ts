import {
  isActivationAction,
  KeyDownEventData,
  useControllableState,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { useCollapsibleContext } from './context';
import type {
  CollapsiblePanelProps,
  CollapsiblePanelState,
  CollapsibleRootProps,
  CollapsibleRootState,
  CollapsibleTriggerProps,
  CollapsibleTriggerState,
} from './types';

function useId(prefix = 'collapsible') {
  return React.useMemo(
    () => `${prefix}-${Math.random().toString(36).slice(2, 9)}`,
    [prefix],
  );
}

export function useCollapsibleRoot(props: CollapsibleRootProps) {
  const {
    defaultOpen = false,
    disabled = false,
    onOpenChange,
    open: controlledOpen,
  } = props;

  const baseId = useId();
  const isDisabled = disabled === true;

  const [open, setOpen] = useControllableState<boolean>({
    prop: controlledOpen,
    defaultProp: defaultOpen,
    onChange: (nextOpen: boolean) => onOpenChange?.(nextOpen, { open: nextOpen }),
  });

  const toggle = React.useCallback(() => {
    if (isDisabled) return;
    setOpen((prev) => !prev);
  }, [isDisabled, setOpen]);

  const state: CollapsibleRootState = {
    disabled: isDisabled,
    open: open ?? false,
  };

  return {
    baseId,
    isDisabled,
    open: open ?? false,
    state,
    toggle,
  };
}

export function useCollapsibleTrigger(props: CollapsibleTriggerProps) {
  const {
    disabled: disabledProp,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    tabIndex: tabIndexProp,
  } = props;

  const context = useCollapsibleContext();
  const isDisabled = disabledProp === true || context.disabled;

  const { focused, focusVisible, focusRingStyle, isFocusable, onBlur, onFocus } = useFocusRing({
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
    (event: any) => {
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
    isDisabled,
    focused,
    focusVisible,
    focusRingStyle,
    handleBlur: onBlur,
    handleFocus: onFocus,
    isFocusable,
    handleAccessibilityAction,
    handlePress,
    open: context.open,
    state,
    tabIndex,
  };
}

export function useCollapsiblePanel(props: CollapsiblePanelProps) {
  const { hiddenUntilFound = false, keepMounted = false } = props;
  const context = useCollapsibleContext();

  const [contentHeight, setContentHeight] = React.useState<number | undefined>(undefined);
  const [contentWidth, setContentWidth] = React.useState<number | undefined>(undefined);

  const handleOnLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setContentHeight(height);
    setContentWidth(width);
  }, []);

  const shouldRender = keepMounted || hiddenUntilFound || context.open;

  const state: CollapsiblePanelState = {
    disabled: context.disabled,
    open: context.open,
    panel: {
      height: contentHeight,
      width: contentWidth,
    }
  };

  return {
    isDisabled: context.disabled,
    handleOnLayout,
    open: context.open,
    shouldRender,
    state,
  };
}
