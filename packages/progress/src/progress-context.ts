import * as React from 'react';

import type { ProgressContextValue } from './types';

export const ProgressContext = React.createContext<ProgressContextValue | null>(
  null,
);

export function useProgressContext() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error(
      'Progress components must be rendered within a Progress.Root component.',
    );
  }
  return context;
}
