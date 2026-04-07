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
export * from './use-accordion-root';
export * from './use-accordion-item';
export * from './use-accordion-trigger';
export * from './use-accordion-header';
export * from './use-accordion-panel';
