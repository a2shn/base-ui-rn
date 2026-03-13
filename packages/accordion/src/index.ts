import { AccordionRoot } from './accordion';
import { AccordionItem } from './item';
import { AccordionHeader } from './header';
import { AccordionTrigger } from './trigger';
import { AccordionPanel } from './panel';

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};

export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
};

export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionPanelProps,
  AccordionRootState,
  AccordionItemState,
  AccordionHeaderState,
  AccordionTriggerState,
  AccordionPanelState,
  AccordionValueChangeDetails,
  AccordionItemOpenChangeDetails,
  Orientation,
} from './types';
