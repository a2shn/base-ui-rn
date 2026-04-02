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

export * from './types';
