import * as React from 'react';

import type { RadioRootState } from './types';

export type RadioRootContextValue = RadioRootState;

export const RadioRootContext =
  React.createContext<RadioRootContextValue | null>(null);

/**
 * Returns the Radio.Root context value.
 * Must be called from within a Radio.Root component.
 */
export function useRadioRootContext(): RadioRootContextValue {
  const context = React.useContext(RadioRootContext);
  if (!context) {
    throw new Error('Radio.Indicator must be used within a Radio.Root');
  }
  return context;
}
