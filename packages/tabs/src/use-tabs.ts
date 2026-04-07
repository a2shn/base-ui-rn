import {
  type KeyDownEventData,
  useControllableState,
  useKeyboardNavigation,
} from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent, View } from 'react-native';

import { type TabMeasurement, useTabsContext } from './context';
import type {
  ActivationDirection,
  TabsRootProps,
  TabsRootState,
  TabValue,
} from './types';

export function useTabsRoot(props: TabsRootProps) {
  const {
    activateOnFocus = false,
    defaultValue,
    onFocusChange,
    onValueChange,
    orientation = 'horizontal',
    value: controlledValue,
  } = props;

  const [currentValue = null, setCurrentValue] =
    useControllableState<TabValue | null>({
      prop: controlledValue,
      defaultProp: defaultValue ?? null,
      onChange: (v: string) => {
        if (v !== null) onValueChange?.(v);
      },
    });

  const [focusedValue, setFocusedValue] = React.useState<TabValue | null>(
    currentValue,
  );
  const [activationDirection, setActivationDirection] =
    React.useState<ActivationDirection>('none');

  const tabRefs = React.useRef<Map<TabValue, React.RefObject<View | null>>>(
    new Map(),
  );
  const [tabMeasurements, setTabMeasurements] = React.useState<
    Map<TabValue, TabMeasurement>
  >(new Map());
  const tabOrder = React.useRef<TabValue[]>([]);
  const panelOrder = React.useRef<TabValue[]>([]);

  React.useEffect(() => {
    if (currentValue !== null) {
      setFocusedValue(currentValue);
    }
  }, [currentValue]);

  const registerTab = React.useCallback(
    (value: TabValue, ref: React.RefObject<View | null>) => {
      tabRefs.current.set(value, ref);
      if (!tabOrder.current.includes(value)) {
        tabOrder.current.push(value);
      }
      return () => {
        tabRefs.current.delete(value);
        tabOrder.current = tabOrder.current.filter((v) => v !== value);
      };
    },
    [],
  );

  const registerPanel = React.useCallback((value: TabValue) => {
    if (!panelOrder.current.includes(value)) {
      panelOrder.current.push(value);
    }
    return () => {
      panelOrder.current = panelOrder.current.filter((v) => v !== value);
    };
  }, []);

  const getTabIndex = React.useCallback(
    (value: TabValue) => tabOrder.current.indexOf(value),
    [],
  );

  const updateTabMeasurement = React.useCallback(
    (value: TabValue, measurement: TabMeasurement) => {
      setTabMeasurements((prev) => {
        const next = new Map(prev);
        next.set(value, measurement);
        return next;
      });
    },
    [],
  );

  const handleValueChange = React.useCallback(
    (newValue: TabValue | null) => {
      if (newValue === currentValue) return;

      const prevIndex =
        currentValue !== null ? tabOrder.current.indexOf(currentValue) : -1;
      const nextIndex =
        newValue !== null ? tabOrder.current.indexOf(newValue) : -1;

      let direction: ActivationDirection = 'none';
      if (prevIndex !== -1 && nextIndex !== -1) {
        if (orientation === 'horizontal') {
          direction = nextIndex > prevIndex ? 'right' : 'left';
        } else {
          direction = nextIndex > prevIndex ? 'down' : 'up';
        }
      }

      setActivationDirection(direction);
      setFocusedValue(newValue);

      setCurrentValue(newValue);
    },
    [currentValue, orientation, setCurrentValue],
  );

  const { handleKeyDown: navHandleKeyDown, registerItem: registerForNav } =
    useKeyboardNavigation<View | null>({
      loop: true,
      orientation,
    });

  const onTabKeyDown = React.useCallback(
    (value: TabValue, event: NativeSyntheticEvent<KeyDownEventData>) => {
      const nextId = navHandleKeyDown(String(value), event);
      if (nextId) {
        const nextValue = tabOrder.current.find((v) => String(v) === nextId);

        if (typeof nextValue === 'undefined') return;

        if (activateOnFocus) {
          handleValueChange(nextValue);
        } else {
          tabRefs.current.get(nextValue)?.current?.focus();
          setFocusedValue(nextValue);
          onFocusChange?.(nextId);
        }
      }
    },
    [navHandleKeyDown, handleValueChange, activateOnFocus, onFocusChange],
  );

  const state: TabsRootState = {
    activationDirection,
    orientation,
    value: currentValue,
  };

  return {
    contextValue: {
      activationDirection,
      focusedValue,
      getTabIndex,
      onFocusChange,
      onTabKeyDown,
      onValueChange: handleValueChange,
      orientation,
      registerPanel,
      registerTab: (v: TabValue, ref: React.RefObject<View | null>) => {
        const unregNav = registerForNav(String(v), ref);
        const unregTab = registerTab(v, ref);
        return () => {
          unregNav();
          unregTab();
        };
      },
      setFocusedValue,
      tabMeasurements,
      updateTabMeasurement,
      value: currentValue,
    },
    state,
  };
}
