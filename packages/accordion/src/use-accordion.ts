import * as React from 'react';
import type {
  View,
  GestureResponderEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  TargetedEvent,
} from 'react-native';
import type {
  AccordionRootProps,
  AccordionRootState,
  AccordionValueChangeDetails,
  AccordionItemProps,
  AccordionItemState,
  AccordionTriggerProps,
  AccordionTriggerState,
  AccordionHeaderState,
  AccordionPanelProps,
  AccordionPanelState,
  KeyPressEventData,
} from './types';
import { useAccordionContext, useAccordionItemContext } from './context';
import { useKeyboardNavigation, useKeyboardActivation } from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';

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
    value: controlledValue,
    onValueChange,
    multiple = false,
    disabled = false,
    orientation = 'vertical',
    loopFocus = true,
    onFocusChange,
  } = props;

  const baseId = useId();

  const { registerItem: registerTrigger, handleKeyDown } =
    useKeyboardNavigation<View | null>({
      orientation,
      loop: loopFocus,
    });

  const onTriggerKeyPress = React.useCallback(
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
    open: openItems.size > 0,
    value: multiple ? currentValue : (currentValue[0] ?? ''),
    orientation,
    disabled,
    multiple,
  };

  return {
    baseId,
    orientation,
    disabled,
    multiple,
    openItems,
    registerItem,
    registerTrigger,
    toggleItem,
    getItemIndex,
    getItemRef,
    onTriggerKeyPress,
    state,
  };
}

export function useAccordionItem(props: AccordionItemProps) {
  const {
    value: valueProp,
    disabled = false,
    onOpenChange: onOpenChangeProp,
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
        value,
        reason: 'toggle',
      });
    }
  }, [open, value, onOpenChangeProp]);

  const itemState: AccordionItemState = {
    open,
    disabled: disabled || context.disabled,
    index,
    value,
  };

  return {
    value,
    open,
    disabled: itemState.disabled,
    index,
    registerTriggerRef: (refItem: React.RefObject<View | null>) => {
      triggerRefRef.current = refItem;
    },
    state: itemState,
  };
}

export function useAccordionTrigger(props: AccordionTriggerProps) {
  const {
    disabled: disabledProp,
    onPress,
    onKeyPress,
    focusVisible: forceFocusVisible = false,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
  } = props;

  const context = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const disabled = disabledProp || itemContext.disabled || context.disabled;

  const { focused, focusVisible, onFocus, onBlur } = useFocus({
    focusVisible: forceFocusVisible,
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

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      const details: AccordionValueChangeDetails = {
        value: itemContext.value,
        reason: 'toggle',
      };

      context.toggleItem(itemContext.value, details);
      onPress?.(event);
    },
    [disabled, itemContext.value, context, onPress],
  );

  const performKeyboardActivation = React.useCallback(() => {
    const details: AccordionValueChangeDetails = {
      value: itemContext.value,
      reason: 'toggle',
    };
    context.toggleItem(itemContext.value, details);
  }, [context, itemContext.value]);

  const handleKeyboardActivation = useKeyboardActivation(
    performKeyboardActivation,
    disabled,
  );

  const handleKeyPress = React.useCallback(
    (event: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;

      handleKeyboardActivation(event);
      context.onTriggerKeyPress(itemContext.value, event);
      onKeyPress?.(event);
    },
    [
      disabled,
      handleKeyboardActivation,
      itemContext.value,
      context,
      onKeyPress,
    ],
  );

  const state: AccordionTriggerState = {
    open: itemContext.open,
    disabled,
    focused,
    focusVisible,
  };

  return {
    disabled,
    handlePress,
    handleKeyPress,
    handleFocus,
    handleBlur,
    focused,
    focusVisible,
    state,
    open: itemContext.open,
  };
}

export function useAccordionHeader() {
  const itemContext = useAccordionItemContext();

  const state: AccordionHeaderState = {
    open: itemContext.open,
    disabled: itemContext.disabled,
    index: itemContext.index,
  };

  return {
    state,
    open: itemContext.open,
    disabled: itemContext.disabled,
    index: itemContext.index,
  };
}

export function useAccordionPanel(props: AccordionPanelProps) {
  const { keepMounted = false, hiddenUntilFound = false } = props;

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
    open: itemContext.open,
    disabled: itemContext.disabled,
    index: itemContext.index,
    '--accordion-panel-height': contentHeight,
    '--accordion-panel-width': contentWidth,
  };

  return {
    state,
    shouldRender,
    onLayout,
    open: itemContext.open,
    orientation: context.orientation,
    disabled: itemContext.disabled,
    index: itemContext.index,
  };
}
