import * as React from 'react';

import type { MeterContextValue } from './types';

export const MeterContext = React.createContext<MeterContextValue | null>(null);

export function useMeterContext() {
  const context = React.useContext(MeterContext);
  if (!context) {
    throw new Error('Meter components must be used within a Meter.Root');
  }
  return context;
}
