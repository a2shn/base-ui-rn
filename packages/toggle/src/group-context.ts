import type { KeyPressEventData } from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import { type TogglePressedChangeDetails } from './types';

export type Orientation = 'horizontal' | 'vertical';

export interface ToggleGroupChangeEventDetails extends TogglePressedChangeDetails {
  /**
   * The value of the toggle that was changed.
   */
  value: string;
}

export interface ToggleGroupContextValue {
  /**
   * The value of the toggle group.
   */
  value: string[];
  /**
   * Whether the toggle group allows multiple selection.
   */
  multiple: boolean;
  /**
   * Whether the toggle group is disabled.
   */
  disabled: boolean;
  /**
   * The orientation of the toggle group.
   */
  orientation: Orientation;
  /**
   * Whether to loop keyboard focus back to the first item.
   */
  loopFocus: boolean;
  /**
   * Callback to change the value of the toggle group.
   */
  toggleValue: (value: string, details: ToggleGroupChangeEventDetails) => void;
  /**
   * Set of values that are currently pressed.
   * Used for efficient lookup.
   */
  valueSet: Set<string>;
  /**
   * Register a toggle within the group for keyboard navigation.
   * Returns an unregister function.
   */
  registerItem: (value: string, ref: React.RefObject<unknown>) => () => void;
  /**
   * Register a toggle value within the group to check for duplicates in dev mode.
   */
  registerValue: (value: string) => () => void;
  /**
   * Callback for when a toggle within the group receives a key press.
   */
  onToggleKeyDown: (
    value: string,
    event: NativeSyntheticEvent<KeyPressEventData>,
  ) => void;
}

export const ToggleGroupContext =
  React.createContext<ToggleGroupContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ToggleGroupContext.displayName = 'ToggleGroupContext';
}

export function useToggleGroupContext() {
  return React.useContext(ToggleGroupContext);
}
