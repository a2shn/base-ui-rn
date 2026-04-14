import { useAccordionItemContext } from './context';
import type { AccordionHeaderState } from './types';

export function useAccordionHeader() {
  const itemContext = useAccordionItemContext();

  const state: AccordionHeaderState = {
    disabled: itemContext.isDisabled,
    index: itemContext.index,
    open: itemContext.open,
  };

  return {
    index: itemContext.index,
    isDisabled: itemContext.isDisabled,
    open: itemContext.open,
    state,
  };
}
