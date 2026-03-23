import * as React from 'react';

interface CollapsibleContextValue {
  baseId: string;
  open: boolean;
  disabled: boolean;
  toggle: () => void;
}

export type { CollapsibleContextValue };

export const CollapsibleContext =
  React.createContext<CollapsibleContextValue | null>(null);

export function useCollapsibleContext(): CollapsibleContextValue {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      'Collapsible components must be used within a Collapsible.Root',
    );
  }
  return context;
}
