import {
  isActivationAction,
  KeyDownEventData,
  useActivationDedup,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TargetedEvent,
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
  const isDisabled = disabled;

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen, { open: newOpen });
    },
    [isControlled, onOpenChange],
  );

  const toggle = React.useCallback(() => {
    if (isDisabled) return;
    handleOpenChange(!open);
  }, [isDisabled, handleOpenChange, open]);

  const state: CollapsibleRootState = {
    disabled: isDisabled,
    open,
  };

  return {
    baseId,
    isDisabled,
    handleOpenChange,
    open,
    state,
    toggle,
  };
}

export function useCollapsibleTrigger(props: CollapsibleTriggerProps) {
  const {
    disabled: disabledProp,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown,
    onPress,
    tabIndex: tabIndexProp,
  } = props;

  const context = useCollapsibleContext();

  const isDisabled = disabledProp || context.disabled;

  const { focused, focusVisible, focusRingStyle, isFocusable, onBlur, onFocus } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp as 0 | -1 | undefined);

  const handleFocus = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onFocus();
      onFocusProp?.(event);
    },
    [onFocus, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      onBlur();
      onBlurProp?.(event);
    },
    [onBlur, onBlurProp],
  );

  const onCommit = React.useCallback(() => {
    context.toggle();
  }, [context]);

  const {
    handlePress: dedupHandlePress,
    handleKeyboardActivation: handleKeyboardToggle,
    handleAccessibilityActivation,
  } = useActivationDedup({
    disabled: isDisabled,
    onCommit,
    pressed: context.open,
  });

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      dedupHandlePress(event);
      onPress?.(event);
    },
    [dedupHandlePress, onPress],
  );

  const handleKeyboardActivation = useKeyboardActivation(handleKeyboardToggle, isDisabled);

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;
      handleKeyboardActivation(event);
      onKeyDown?.(event);
    },
    [isDisabled, handleKeyboardActivation, onKeyDown],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: any) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        handleAccessibilityActivation();
      }
    },
    [isDisabled, handleAccessibilityActivation],
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
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    handleAccessibilityAction,
    isFocusable,
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
