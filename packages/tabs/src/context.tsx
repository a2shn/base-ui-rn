import * as React from 'react';
import type { NativeSyntheticEvent, View } from 'react-native';

import type {
  ActivationDirection,
  Orientation,
  TabValue,
} from './types';
import { KeyDownEventData } from '@base-ui-rn/core';

export interface TabMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TabsContextValue {
  value: TabValue | null;
  focusedValue: TabValue | null;
  setFocusedValue: (value: TabValue | null) => void;
  orientation: Orientation;
  activationDirection: ActivationDirection;
  onValueChange: (value: TabValue | null) => void;
  registerTab: (value: TabValue, ref: React.RefObject<View | null>) => () => void;
  registerPanel: (value: TabValue) => () => void;
  onTabKeyDown: (value: TabValue, event: NativeSyntheticEvent<KeyDownEventData>) => void;
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
