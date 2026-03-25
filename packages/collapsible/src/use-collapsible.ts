import { useKeyboardActivation } from '@base-ui-rn/core';
import { useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type {
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
  KeyPressEventData,
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
    if (disabled) return;
    handleOpenChange(!open);
  }, [disabled, handleOpenChange, open]);

  const state: CollapsibleRootState = {
    disabled,
    focusVisible: false,
    open,
  };

  return {
    baseId,
    disabled,
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
    onBlur: onBlurProp,
    onFocus: onFocusProp,
  } = props;

  const context = useCollapsibleContext();

  const disabled = disabledProp || context.disabled;

  const { focused, focusRingStyle, focusVisible, onBlur, onFocus } =
    useFocusRing({
      disableDefaultFocusRing,
    });

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

  const handlePress = React.useCallback(() => {
    if (disabled) return;
    context.toggle();
  }, [disabled, context]);

  const performKeyboardActivation = React.useCallback(() => {
    context.toggle();
  }, [context]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    disabled,
  );

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;
      handleKeyboardActivation(event);
    },
    [disabled, handleKeyboardActivation],
  );

  const state: CollapsibleTriggerState = {
    disabled,
    focused,
    focusVisible,
    open: context.open,
  };

  return {
    disabled,
    focused,
    focusRingStyle,
    focusVisible,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    open: context.open,
    state,
  };
}

export function useCollapsiblePanel(props: CollapsiblePanelProps) {
  const {
    disableDefaultFocusRing = false,
    hiddenUntilFound = false,
    keepMounted = false,
  } = props;

  const context = useCollapsibleContext();

  const { focused, focusVisible, onBlur, onFocus } = useFocusRing({
    disableDefaultFocusRing,
  });

  const [contentHeight, setContentHeight] = React.useState<number | undefined>(
    undefined,
  );
  const [contentWidth, setContentWidth] = React.useState<number | undefined>(
    undefined,
  );

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setContentHeight(height);
    setContentWidth(width);
  }, []);

  const shouldRender = keepMounted || hiddenUntilFound || context.open;

  const state: CollapsiblePanelState = {
    disabled: context.disabled,
    focusVisible,
    open: context.open,
    panel: {
      height: contentHeight,
      width: contentWidth,
    },
  };

  return {
    disabled: context.disabled,
    focused,
    focusVisible,
    handleBlur: onBlur,
    handleFocus: onFocus,
    onLayout,
    open: context.open,
    shouldRender,
    state,
  };
}
