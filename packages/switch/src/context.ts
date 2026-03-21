import * as React from 'react';

import type { SwitchState } from './types';

export type SwitchContextValue = SwitchState;

export const SwitchContext = React.createContext<SwitchContextValue | null>(
  null,
);

export function useSwitchContext(): SwitchContextValue {
  const context = React.useContext(SwitchContext);
  if (!context) {
    throw new Error('Switch components must be used within a Switch.Root');
  }
  return context;
}
