import * as React from 'react';

import type { ProgressContextValue } from './types';

/**
 * React context for the progress bar component.
 */
export const ProgressContext = React.createContext<ProgressContextValue | null>(
  null,
);

/**
 * Custom hook to access the progress bar context.
 * @throws Will throw an error if used outside of a Progress.Root component.
 * @returns {ProgressContextValue} The progress bar context.
 */
export function useProgressContext() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error(
      'Progress components must be rendered within a Progress.Root component.',
    );
  }
  return context;
}
