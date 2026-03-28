import { useKeyboardActivation, useKeyboardNavigation } from '@base-ui-rn/core';
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
  KeyPressEventData,
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

/**
 * Manages the state and logic for the AccordionRoot primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
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

  const { handleKeyDown, registerItem: registerTrigger } =
    useKeyboardNavigation<View | null>({
      loop: loopFocus,
      orientation,
    });

  const onTriggerKeyDown = React.useCallback(
    (value: string, event: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;
      const nextId = handleKeyDown(value, event);
      if (nextId) {
        onFocusChange?.(nextId);
      }
    },
    [disabled, handleKeyDown, onFocusChange],
  );

  const [internalValue, setInternalValue] = React.useState<string[]>(() =>
    getValueArray(defaultValue),
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled
    ? getValueArray(controlledValue)
    : internalValue;
  const openItems = new Set(currentValue);

  const itemRefs = React.useRef<Map<string, React.RefObject<View | null>>>(
    new Map(),
  );
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
    disabled,
    multiple,
    open: openItems.size > 0,
    orientation,
    value: multiple ? currentValue : (currentValue[0] ?? ''),
  };

  return {
    baseId,
    disabled,
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

/**
 * Manages the state and logic for the AccordionItem primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useAccordionItem(props: AccordionItemProps) {
  const {
    disabled = false,
    onOpenChange: onOpenChangeProp,
    value: valueProp,
  } = props;

  const context = useAccordionContext();

  const triggerRefRef = React.useRef<React.RefObject<View | null>>({
    current: null,
  });
  const generatedId = useId('item');
  const value = valueProp ?? generatedId;

  React.useLayoutEffect(() => {
    const unregisterItem = context.registerItem(value, triggerRefRef.current);
    const unregisterTrigger = context.registerTrigger(
      value,
      triggerRefRef.current,
    );
    return () => {
      unregisterItem();
      unregisterTrigger();
    };
  }, [value, context]);

  const index = context.getItemIndex(value);
  const open = context.openItems.has(value);

  React.useEffect(() => {
    if (onOpenChangeProp) {
      onOpenChangeProp(open, {
        open,
        reason: 'toggle',
        value,
      });
    }
  }, [open, value, onOpenChangeProp]);

  const itemState: AccordionItemState = {
    disabled: disabled || context.disabled,
    index,
    open,
    value,
  };

  return {
    disabled: itemState.disabled,
    index,
    open,
    registerTriggerRef: (refItem: React.RefObject<View | null>) => {
      triggerRefRef.current = refItem;
    },
    state: itemState,
    value,
  };
}

/**
 * Manages the state and logic for the AccordionTrigger primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useAccordionTrigger(props: AccordionTriggerProps) {
  const {
    disabled: disabledProp,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown,
    onPress,
  } = props;

  const context = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const disabled = disabledProp || itemContext.disabled || context.disabled;

  const { focused, focusRingStyle, isFocusable, onBlur, onFocus } =
    useFocusRing({
      disabled,
      disableDefaultFocusRing,
      focusableWhenDisabled,
    });

  const tabIndex = resolveTabIndex(
    isFocusable,
    props.tabIndex as 0 | -1 | undefined,
  );

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

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      const details: AccordionValueChangeDetails = {
        reason: 'toggle',
        value: itemContext.value,
      };

      context.toggleItem(itemContext.value, details);
      onPress?.(event);
    },
    [disabled, itemContext.value, context, onPress],
  );

  const performKeyboardActivation = React.useCallback(() => {
    const details: AccordionValueChangeDetails = {
      reason: 'toggle',
      value: itemContext.value,
    };
    context.toggleItem(itemContext.value, details);
  }, [context, itemContext.value]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    disabled,
  );

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;

      handleKeyboardActivation(event);
      context.onTriggerKeyDown(itemContext.value, event);
      onKeyDown?.(event);
    },
    [disabled, handleKeyboardActivation, itemContext.value, context, onKeyDown],
  );

  const state: AccordionTriggerState = {
    disabled,
    focused,
    open: itemContext.open,
  };

  return {
    disabled,
    focused,
    focusRingStyle,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    isFocusable,
    open: itemContext.open,
    state,
    tabIndex,
  };
}
/**
 * Manages the state and logic for the AccordionHeader primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useAccordionHeader() {
  const itemContext = useAccordionItemContext();

  const state: AccordionHeaderState = {
    disabled: itemContext.disabled,
    index: itemContext.index,
    open: itemContext.open,
  };

  return {
    disabled: itemContext.disabled,
    index: itemContext.index,
    open: itemContext.open,
    state,
  };
}

/**
 * Manages the state and logic for the AccordionPanel primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useAccordionPanel(props: AccordionPanelProps) {
  const { hiddenUntilFound = false, keepMounted = false } = props;

  const context = useAccordionContext();
  const itemContext = useAccordionItemContext();

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

  const shouldRender = keepMounted || hiddenUntilFound || itemContext.open;
  const state: AccordionPanelState = {
    disabled: itemContext.disabled,
    index: itemContext.index,
    open: itemContext.open,
    panel: {
      height: contentHeight,
      width: contentWidth,
    },
  };

  return {
    disabled: itemContext.disabled,
    index: itemContext.index,
    onLayout,
    open: itemContext.open,
    orientation: context.orientation,
    shouldRender,
    state,
  };
}
