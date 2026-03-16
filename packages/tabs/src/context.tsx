import * as React from 'react';
import type { View } from 'react-native';
import type {
  TabValue,
  Orientation,
  ActivationDirection,
  KeyPressEventData,
} from './types';
import type { NativeSyntheticEvent } from 'react-native';
import { FocusVisibleProps } from '@base-ui-rn/core';

export interface TabMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TabsContextValue extends FocusVisibleProps {
  value: TabValue | null;
  orientation: Orientation;
  activationDirection: ActivationDirection;
  onValueChange: (value: TabValue | null) => void;
  registerTab: (
    value: TabValue,
    ref: React.RefObject<View | null>,
  ) => () => void;
  registerPanel: (value: TabValue) => () => void;
  onTabKeyPress: (
    value: TabValue,
    event: NativeSyntheticEvent<KeyPressEventData>,
  ) => void;
  onFocusChange?: (value: string) => void;
  getTabIndex: (value: TabValue) => number;
  tabMeasurements: Map<TabValue, TabMeasurement>;
  updateTabMeasurement: (value: TabValue, measurement: TabMeasurement) => void;
}

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs.Root');
  }
  return context;
}
