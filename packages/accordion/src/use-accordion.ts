import {
  isActivationAction,
  useActivationDedup,
  useKeyboardActivation,
  useKeyboardNavigation,
  type KeyDownEventData,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TargetedEvent,
  View,
} from 'react-native';

import { useAccordionContext, useAccordionItemContext } from './context';
import type {
  AccordionHeaderState,
  AccordionItemProps,
  AccordionItemState,
  AccordionPanelProps,
  AccordionPanelState,
  AccordionRootProps,
  AccordionRootState,
  AccordionTriggerProps,
  AccordionTriggerState,
  AccordionValueChangeDetails,
} from './types';

function useId(prefix = 'accordion') {
  return React.useMemo(
    () => `${prefix}-${Math.random().toString(36).slice(2, 9)}`,
    [prefix],
  );
}

function getValueArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function useAccordionRoot(props: AccordionRootProps) {
  const {
    defaultValue,
    disabled = false,
    loopFocus = true,
    multiple = false,
    onFocusChange,
    onValueChange,
    orientation = 'vertical',
    value: controlledValue,
  } = props;

  const baseId = useId();
  const isDisabled = disabled;

  const { handleKeyDown, registerItem: registerTrigger } = useKeyboardNavigation<View | null>({
    loop: loopFocus,
    orientation,
  });

  const onTriggerKeyDown = React.useCallback(
    (value: string, event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;
      const nextId = handleKeyDown(value, event);
      if (nextId) {
        onFocusChange?.(nextId);
      }
    },
    [isDisabled, handleKeyDown, onFocusChange],
  );

  const [internalValue, setInternalValue] = React.useState<string[]>(() =>
    getValueArray(defaultValue),
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? getValueArray(controlledValue) : internalValue;
  const openItems = new Set(currentValue);

  const itemRefs = React.useRef<Map<string, React.RefObject<View | null>>>(new Map());
  const itemCount = React.useRef(0);
  const itemIndexes = React.useRef<Map<string, number>>(new Map());

  const registerItem = React.useCallback(
    (value: string, refItem: React.RefObject<View | null>) => {
      itemRefs.current.set(value, refItem);
      if (!itemIndexes.current.has(value)) {
        const index = itemCount.current;
        itemCount.current += 1;
        itemIndexes.current.set(value, index);
      }
      return () => {
        itemRefs.current.delete(value);
      };
    },
    [],
  );

  const getItemIndex = React.useCallback((value: string) => {
    if (!itemIndexes.current.has(value)) {
      const index = itemCount.current;
      itemCount.current += 1;
      itemIndexes.current.set(value, index);
    }
    return itemIndexes.current.get(value) ?? -1;
  }, []);

  const getItemRef = React.useCallback(
    (value: string) => itemRefs.current.get(value) ?? null,
    [],
  );

  const toggleItem = React.useCallback(
    (toggledValue: string, details: AccordionValueChangeDetails) => {
      let newValue: string[];

      if (multiple) {
        if (openItems.has(toggledValue)) {
          newValue = currentValue.filter((v) => v !== toggledValue);
        } else {
          newValue = [...currentValue, toggledValue];
        }
      } else {
        newValue = openItems.has(toggledValue) ? [] : [toggledValue];
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      const finalValue = multiple ? newValue : (newValue[0] ?? '');
      onValueChange?.(finalValue, { ...details, value: finalValue });
    },
    [multiple, currentValue, openItems, isControlled, onValueChange],
  );

  const state: AccordionRootState = {
    disabled: isDisabled,
    multiple,
    open: openItems.size > 0,
    orientation,
    value: multiple ? currentValue : (currentValue[0] ?? ''),
  };

  return {
    baseId,
    isDisabled,
    getItemIndex,
    getItemRef,
    multiple,
    onTriggerKeyDown,
    openItems,
    orientation,
    registerItem,
    registerTrigger,
    state,
    toggleItem,
  };
}

export function useAccordionItem(props: AccordionItemProps) {
  const { disabled = false, onOpenChange: onOpenChangeProp, value: valueProp } = props;
  const rootContext = useAccordionContext();

  const triggerRefRef = React.useRef<React.RefObject<View | null>>({ current: null });
  const generatedId = useId('item');
  const value = valueProp ?? generatedId;

  React.useLayoutEffect(() => {
    const unregisterItem = rootContext.registerItem(value, triggerRefRef.current);
    const unregisterTrigger = rootContext.registerTrigger(value, triggerRefRef.current);
    return () => {
      unregisterItem();
      unregisterTrigger();
    };
  }, [value, rootContext]);

  const index = rootContext.getItemIndex(value);
  const open = rootContext.openItems.has(value);
  const isDisabled = disabled || rootContext.isDisabled;

  React.useEffect(() => {
    if (onOpenChangeProp) {
      onOpenChangeProp(open, { open, value });
    }
  }, [open, value, onOpenChangeProp]);

  const state: AccordionItemState = {
    disabled: isDisabled,
    index,
    open,
    value,
  };

  return {
    isDisabled,
    index,
    open,
    registerTriggerRef: (refItem: React.RefObject<View | null>) => {
      triggerRefRef.current = refItem;
    },
    state,
    value,
  };
}

export function useAccordionTrigger(props: AccordionTriggerProps) {
  const {
    disabled: disabledProp,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown,
    onPress, // Extracted so it isn't swallowed
  } = props;

  const rootContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const isDisabled = disabledProp || itemContext.isDisabled || rootContext.isDisabled;

  const { focused, focusRingStyle, focusVisible, isFocusable, onBlur: focusOnBlur, onFocus: focusOnFocus } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, props.tabIndex as 0 | -1 | undefined);

  const handleFocus = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      focusOnFocus();
      onFocusProp?.(event);
    },
    [focusOnFocus, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      focusOnBlur();
      onBlurProp?.(event);
    },
    [focusOnBlur, onBlurProp],
  );

  const onCommit = React.useCallback(() => {
    rootContext.toggleItem(itemContext.value, { value: itemContext.value });
  }, [rootContext, itemContext.value]);

  const {
    handlePress: dedupHandlePress,
    handleKeyboardActivation: handleKeyboardToggle,
    handleAccessibilityActivation,
  } = useActivationDedup({
    disabled: isDisabled,
    onCommit,
    pressed: itemContext.open,
    // NO onPress HERE
  });

  // Manually compose the dedup's press handler with the user's onPress
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
      rootContext.onTriggerKeyDown(itemContext.value, event);
      onKeyDown?.(event);
    },
    [isDisabled, handleKeyboardActivation, itemContext.value, rootContext, onKeyDown],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: any) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        handleAccessibilityActivation();
      }
    },
    [isDisabled, handleAccessibilityActivation],
  );

  const state: AccordionTriggerState = {
    disabled: isDisabled,
    focused,
    focusVisible,
    open: itemContext.open,
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
    open: itemContext.open,
    state,
    tabIndex,
  };
}

export function useAccordionHeader() {
  const itemContext = useAccordionItemContext();

  const state: AccordionHeaderState = {
    disabled: itemContext.isDisabled,
    index: itemContext.index,
    open: itemContext.open,
  };

  return {
    isDisabled: itemContext.isDisabled,
    index: itemContext.index,
    open: itemContext.open,
    state,
  };
}

export function useAccordionPanel(props: AccordionPanelProps) {
  const { hiddenUntilFound = false, keepMounted = false } = props;

  const rootContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const [contentHeight, setContentHeight] = React.useState<number | undefined>(undefined);
  const [contentWidth, setContentWidth] = React.useState<number | undefined>(undefined);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setContentHeight(height);
    setContentWidth(width);
  }, []);

  const shouldRender = keepMounted || hiddenUntilFound || itemContext.open;

  const state: AccordionPanelState = {
    disabled: itemContext.isDisabled,
    index: itemContext.index,
    open: itemContext.open,
    panel: {
      height: contentHeight,
      width: contentWidth
    }
  };

  return {
    isDisabled: itemContext.isDisabled,
    index: itemContext.index,
    onLayout,
    open: itemContext.open,
    orientation: rootContext.orientation,
    shouldRender,
    state,
  };
}
