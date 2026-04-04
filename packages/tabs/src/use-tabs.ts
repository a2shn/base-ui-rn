import {
  isActivationAction,
  KeyDownEventData,
  useActivationDedup,
  useKeyboardActivation,
  useKeyboardNavigation,
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

import { type TabMeasurement, useTabsContext } from './context';
import type {
  ActivationDirection,
  TabPanelProps,
  TabPanelState,
  TabProps,
  TabsIndicatorState,
  TabsListState,
  TabsRootProps,
  TabsRootState,
  TabState,
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

  const [internalValue, setInternalValue] = React.useState<TabValue | null>(
    defaultValue ?? null,
  );
  const [focusedValue, setFocusedValue] = React.useState<TabValue | null>(
    defaultValue ?? null,
  );
  const [activationDirection, setActivationDirection] =
    React.useState<ActivationDirection>('none');

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const tabRefs = React.useRef<Map<TabValue, React.RefObject<View | null>>>(new Map());
  const [tabMeasurements, setTabMeasurements] = React.useState<Map<TabValue, TabMeasurement>>(new Map());
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

      const prevIndex = currentValue !== null ? tabOrder.current.indexOf(currentValue) : -1;
      const nextIndex = newValue !== null ? tabOrder.current.indexOf(newValue) : -1;

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

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [currentValue, isControlled, onValueChange, orientation],
  );

  const { handleKeyDown: navHandleKeyDown, registerItem: registerForNav } = useKeyboardNavigation<View | null>({
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

export function useTabsList() {
  const context = useTabsContext();

  const state: TabsListState = {
    activationDirection: context.activationDirection,
    orientation: context.orientation,
  };

  return { state };
}

export function useTab(props: TabProps) {
  const {
    disabled: disabledProp = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onKeyDown,
    onPress,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const context = useTabsContext();
  const ref = React.useRef<View>(null);

  const isDisabled = disabledProp;

  React.useLayoutEffect(() => {
    return context.registerTab(value, ref);
  }, [value, context]);

  const { focused, focusVisible, focusRingStyle, isFocusable, onBlur, onFocus } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp as 0 | -1 | undefined);
  const isFocusedFromRoot = context.focusedValue === value;
  const active = context.value === value;

  const handleFocusInternal = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onFocus();
      context.setFocusedValue(value);
      context.onFocusChange?.(String(value));
      onFocusProp?.(e);
    },
    [onFocus, onFocusProp, context, value],
  );

  const handleBlurInternal = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      onBlur();
      onBlurProp?.(e);
    },
    [onBlur, onBlurProp],
  );

  const handleActivation = React.useCallback(() => {
    context.onValueChange(value);
  }, [context, value]);

  const {
    handlePress: dedupHandlePress,
    handleKeyboardActivation: handleKeyboardToggle,
    handleAccessibilityActivation,
  } = useActivationDedup({
    disabled: isDisabled,
    onCommit: handleActivation,
    pressed: active,
  });

  const handlePressInternal = React.useCallback(
    (event: GestureResponderEvent) => {
      dedupHandlePress(event);
      onPress?.(event);
    },
    [dedupHandlePress, onPress],
  );

  const handleKeyboardActivation = useKeyboardActivation(handleKeyboardToggle, isDisabled);

  const handleKeyDownInternal = React.useCallback(
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;
      handleKeyboardActivation(event);
      context.onTabKeyDown(value, event);
      onKeyDown?.(event);
    },
    [isDisabled, handleKeyboardActivation, context, value, onKeyDown],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: any) => {
      if (isActivationAction(event.nativeEvent.actionName) && !isDisabled) {
        handleAccessibilityActivation();
      }
    },
    [isDisabled, handleAccessibilityActivation],
  );

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      context.updateTabMeasurement(value, e.nativeEvent.layout);
    },
    [context, value],
  );

  const state: TabState = {
    activationDirection: context.activationDirection,
    active,
    isDisabled,
    focused: focused || isFocusedFromRoot,
    focusVisible,
    orientation: context.orientation,
  };

  return {
    isDisabled,
    focusRingStyle,
    handleBlur: handleBlurInternal,
    handleFocus: handleFocusInternal,
    handleKeyDown: handleKeyDownInternal,
    handlePress: handlePressInternal,
    handleAccessibilityAction,
    isFocusable,
    onLayout,
    ref,
    state,
    tabIndex,
  };
}

export function useTabsIndicator() {
  const context = useTabsContext();
  const activeMeasurement = context.value !== null ? context.tabMeasurements.get(context.value) : null;

  const state: TabsIndicatorState = {
    activationDirection: context.activationDirection,
    orientation: context.orientation,
    tab: {
      height: activeMeasurement?.height,
      left: activeMeasurement?.x,
      top: activeMeasurement?.y,
      width: activeMeasurement?.width,
    },
  };

  return { state };
}

export function useTabPanel(props: TabPanelProps) {
  const { keepMounted = false, value } = props;
  const context = useTabsContext();

  React.useLayoutEffect(() => {
    return context.registerPanel(value);
  }, [value, context]);

  const active = context.value === value;
  const index = context.getTabIndex(value);

  const state: TabPanelState = {
    activationDirection: context.activationDirection,
    hidden: !active,
    index,
    orientation: context.orientation,
  };

  const shouldRender = active || keepMounted;

  return { shouldRender, state };
}
