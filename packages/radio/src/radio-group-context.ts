import * as React from 'react';

import type { RadioGroupContextValue } from './types';

export const RadioGroupContext =
  React.createContext<RadioGroupContextValue | null>(null);

/**
 * Returns the RadioGroup context value.
 * Must be called from within a RadioGroup component.
 */
export function useRadioGroupContext(): RadioGroupContextValue {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio components must be used within a RadioGroup');
  }
  return context;
}

/**
 * Returns the RadioGroup context value or null when used outside a group.
 */
export function useOptionalRadioGroupContext(): RadioGroupContextValue | null {
  return React.useContext(RadioGroupContext);
}
