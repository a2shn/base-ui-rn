import * as React from 'react';
import {
  type View,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';
import { useKeyboardNavigation, useKeyboardActivation } from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import type {
  TabValue,
  TabsRootProps,
  TabsRootState,
  TabsListState,
  TabProps,
  TabState,
  TabsIndicatorState,
  TabPanelProps,
  TabPanelState,
  ActivationDirection,
  KeyPressEventData,
} from './types';
import { useTabsContext, type TabMeasurement } from './context';

/**
 * Manages the state and logic for the Tabs primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useTabsRoot(props: TabsRootProps) {
  const {
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    activateOnFocus = false,
    onFocusChange,
  } = props as any; // Cast temporarily to access internal props

  const [internalValue, setInternalValue] = React.useState<TabValue | null>(
    defaultValue ?? null,
  );
  const [activationDirection, setActivationDirection] =
    React.useState<ActivationDirection>('none');

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const tabRefs = React.useRef<Map<TabValue, React.RefObject<View | null>>>(
    new Map(),
  );
  const [tabMeasurements, setTabMeasurements] = React.useState<
    Map<TabValue, TabMeasurement>
  >(new Map());
  const tabOrder = React.useRef<TabValue[]>([]);
  const panelOrder = React.useRef<TabValue[]>([]);

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

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [currentValue, isControlled, onValueChange, orientation],
  );

  const { registerItem: registerForNav, handleKeyDown } =
    useKeyboardNavigation<View | null>({
      orientation,
      loop: true,
    });

  const onTabKeyPress = React.useCallback(
    (value: TabValue, event: NativeSyntheticEvent<KeyPressEventData>) => {
      const nextId = handleKeyDown(String(value), event);
      if (nextId) {
        if (activateOnFocus) {
          handleValueChange(nextId);
        } else {
          onFocusChange?.(nextId);
        }
      }
    },
    [handleKeyDown, handleValueChange, activateOnFocus, onFocusChange],
  );

  const state: TabsRootState = {
    value: currentValue,
    orientation,
    activationDirection,
  };

  return {
    state,
    contextValue: {
      value: currentValue,
      orientation,
      activationDirection,
      onValueChange: handleValueChange,
      onFocusChange,
      registerTab: (v: TabValue, ref: React.RefObject<View | null>) => {
        const unregNav = registerForNav(String(v), ref);
        const unregTab = registerTab(v, ref);
        return () => {
          unregNav();
          unregTab();
        };
      },
      registerPanel,
      onTabKeyPress,
      getTabIndex,
      tabMeasurements,
      updateTabMeasurement,
    },
  };
}

export function useTabsList() {
  const context = useTabsContext();

  const state: TabsListState = {
    orientation: context.orientation,
    activationDirection: context.activationDirection,
  };

  return { state };
}

export function useTab(props: TabProps) {
  const {
    value,
    disabled = false,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    focusVisible: forceFocusVisible = false,
  } = props;

  const context = useTabsContext();
  const ref = React.useRef<View>(null);

  React.useLayoutEffect(() => {
    return context.registerTab(value, ref);
  }, [value, context]);

  const { focused, focusVisible, onFocus, onBlur } = useFocus({
    focusVisible: forceFocusVisible,
  });

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onFocus();
      context.onFocusChange?.(String(value));
      onFocusProp?.(e);
    },
    [onFocus, onFocusProp, context, value],
  );

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onBlur();
      onBlurProp?.(e);
    },
    [onBlur, onBlurProp],
  );

  const handleActivation = React.useCallback(() => {
    context.onValueChange(value);
  }, [context, value]);

  const handleKeyboardActivation = useKeyboardActivation(
    handleActivation,
    disabled,
  );

  const handlePress = React.useCallback(() => {
    if (disabled) return;
    handleActivation();
  }, [disabled, handleActivation]);

  const handleKeyPress = React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData>) => {
      if (disabled) return;
      handleKeyboardActivation(e);
      context.onTabKeyPress(value, e);
    },
    [disabled, handleKeyboardActivation, context, value],
  );

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      context.updateTabMeasurement(value, e.nativeEvent.layout);
    },
    [context, value],
  );

  const active = context.value === value;

  const state: TabState = {
    active,
    disabled,
    orientation: context.orientation,
    activationDirection: context.activationDirection,
    focused,
    focusVisible,
  };

  return {
    ref,
    state,
    handlePress,
    handleKeyPress,
    handleFocus,
    handleBlur,
    onLayout,
  };
}

export function useTabsIndicator() {
  const context = useTabsContext();
  const activeMeasurement = context.value !== null ? context.tabMeasurements.get(context.value) : null;

  const state: TabsIndicatorState = {
    orientation: context.orientation,
    activationDirection: context.activationDirection,
    '--active-tab-top': activeMeasurement?.y,
    '--active-tab-left': activeMeasurement?.x,
    '--active-tab-width': activeMeasurement?.width,
    '--active-tab-height': activeMeasurement?.height,
  };

  return { state };
}

export function useTabPanel(props: TabPanelProps) {
  const { value, keepMounted = false } = props;
  const context = useTabsContext();

  React.useLayoutEffect(() => {
    return context.registerPanel(value);
  }, [value, context]);

  const active = context.value === value;
  const index = context.getTabIndex(value);

  const state: TabPanelState = {
    hidden: !active,
    orientation: context.orientation,
    activationDirection: context.activationDirection,
    index,
  };

  const shouldRender = active || keepMounted;

  return { state, shouldRender };
}
