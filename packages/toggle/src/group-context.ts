import type { KeyDownEventData } from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

export type Orientation = 'horizontal' | 'vertical';

export interface ToggleGroupValueContextValue {
  value: string[];
  valueSet: Set<string>;
}

export interface ToggleGroupActionContextValue {
  multiple: boolean;
  disabled: boolean;
  orientation: Orientation;
  loopFocus: boolean;
  toggleValue: (value: string) => void;
  registerItem: (value: string, ref: React.RefObject<unknown>) => () => void;
  registerValue: (value: string) => () => void;
  onToggleKeyDown: (
    value: string,
    event: NativeSyntheticEvent<KeyDownEventData>,
  ) => void;
}

export const ToggleGroupValueContext =
  React.createContext<ToggleGroupValueContextValue | null>(null);

export const ToggleGroupActionContext =
  React.createContext<ToggleGroupActionContextValue | null>(null);

export function useToggleGroupValueContext() {
  return React.useContext(ToggleGroupValueContext);
}

export function useToggleGroupActionContext() {
  return React.useContext(ToggleGroupActionContext);
}
