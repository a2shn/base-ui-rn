import { AccordionRoot } from './accordion';
import { AccordionHeader } from './header';
import { AccordionItem } from './item';
import { AccordionPanel } from './panel';
import { AccordionTrigger } from './trigger';

export const Accordion = {
  Header: AccordionHeader,
  Item: AccordionItem,
  Panel: AccordionPanel,
  Root: AccordionRoot,
  Trigger: AccordionTrigger,
};

export {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
};

export type {
  AccordionHeaderProps,
  AccordionHeaderState,
  AccordionItemOpenChangeDetails,
  AccordionItemProps,
  AccordionItemState,
  AccordionPanelProps,
  AccordionPanelState,
  AccordionRootProps,
  AccordionRootState,
  AccordionTriggerProps,
  AccordionTriggerState,
  AccordionValueChangeDetails,
  Orientation,
} from './types';
