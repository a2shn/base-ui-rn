import {
  type KeyDownEventData,
  useControllableState,
  useKeyboardNavigation,
} from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent, View } from 'react-native';

import { useAccordionContext } from './context';
import type { AccordionRootProps, AccordionRootState } from './types';

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

  const isDisabled = disabled === true;

  const { handleKeyDown, registerItem: registerTrigger } =
    useKeyboardNavigation<View | null>({
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

  const [value, setValue] = useControllableState<string | string[]>({
    prop: controlledValue,
    defaultProp: defaultValue ?? (multiple ? [] : ''),
    onChange: (v: string | string[]) => onValueChange?.(v, { value: v }),
  });

  const currentValue = getValueArray(value);

  const openItems = React.useMemo(() => new Set(currentValue), [currentValue]);

  const itemRefs = React.useRef<Map<string, React.RefObject<View | null>>>(
    new Map(),
  );
  const itemCount = React.useRef(0);
  const itemIndexes = React.useRef<Map<string, number>>(new Map());

  const registerItem = React.useCallback(
    (itemValue: string, refItem: React.RefObject<View | null>) => {
      itemRefs.current.set(itemValue, refItem);

      if (!itemIndexes.current.has(itemValue)) {
        const index = itemCount.current;
        itemCount.current += 1;
        itemIndexes.current.set(itemValue, index);
      }

      return () => {
        itemRefs.current.delete(itemValue);
      };
    },
    [],
  );

  const getItemIndex = React.useCallback((itemValue: string) => {
    if (!itemIndexes.current.has(itemValue)) {
      const index = itemCount.current;
      itemCount.current += 1;
      itemIndexes.current.set(itemValue, index);
    }

    return itemIndexes.current.get(itemValue) ?? -1;
  }, []);

  const getItemRef = React.useCallback(
    (itemValue: string) => itemRefs.current.get(itemValue) ?? null,
    [],
  );

  const toggleItem = React.useCallback(
    (toggledValue: string) => {
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

      const finalValue = multiple ? newValue : (newValue[0] ?? '');
      setValue(finalValue);
    },
    [multiple, currentValue, openItems, setValue],
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
