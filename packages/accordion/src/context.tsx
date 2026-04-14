import { KeyDownEventData } from '@base-ui-rn/core';
import * as React from 'react';
import { type NativeSyntheticEvent, View } from 'react-native';

import type { AccordionValueChangeDetails, Orientation } from './types';

interface AccordionContextValue {
  baseId: string;
  orientation: Orientation;
  isDisabled: boolean;
  multiple: boolean;
  openItems: Set<string>;
  registerItem: (
    value: string,
    ref: React.RefObject<View | null>,
  ) => () => void;
  registerTrigger: (
    value: string,
    ref: React.RefObject<View | null>,
  ) => () => void;
  toggleItem: (value: string, details: AccordionValueChangeDetails) => void;
  getItemIndex: (value: string) => number;
  getItemRef: (value: string) => React.RefObject<View | null> | null;
  onTriggerKeyDown: (
    value: string,
    event: NativeSyntheticEvent<KeyDownEventData>,
  ) => void;
}

export type { AccordionContextValue };

export const AccordionContext =
  React.createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion components must be used within an Accordion.Root',
    );
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  isDisabled: boolean;
  index: number;
  triggerRef: React.RefObject<View | null>;
}

export const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext(): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      'Accordion components must be used within an Accordion.Item',
    );
  }
  return context;
}
