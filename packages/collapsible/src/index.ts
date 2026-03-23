import { CollapsibleRoot } from './collapsible';
import { CollapsiblePanel } from './panel';
import { CollapsibleTrigger } from './trigger';

export const Collapsible = {
  Panel: CollapsiblePanel,
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
};

export { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger };

export type {
  CollapsiblePanelProps,
  CollapsiblePanelState,
  CollapsibleRootOpenChangeDetails,
  CollapsibleRootProps,
  CollapsibleRootState,
  CollapsibleTriggerProps,
  CollapsibleTriggerState,
} from './types';
