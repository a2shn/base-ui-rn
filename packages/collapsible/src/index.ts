import { CollapsibleRoot } from './collapsible';
import { CollapsiblePanel } from './panel';
import { CollapsibleTrigger } from './trigger';

export const Collapsible = {
  Panel: CollapsiblePanel,
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
};

export * from './types';
export * from './use-collapsible-root';
export * from './use-collapsible-trigger';
export * from './use-collapsible-panel';
