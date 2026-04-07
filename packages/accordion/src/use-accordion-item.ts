import * as React from 'react';
import type { View } from 'react-native';

import { useAccordionContext } from './context';
import type { AccordionItemProps, AccordionItemState } from './types';

function useId(prefix = 'accordion') {
  return React.useMemo(
    () => `${prefix}-${Math.random().toString(36).slice(2, 9)}`,
    [prefix],
  );
}

export function useAccordionItem(props: AccordionItemProps) {
  const {
    disabled = false,
    onOpenChange: onOpenChangeProp,
    value: valueProp,
  } = props;
  const rootContext = useAccordionContext();

  const generatedId = useId('item');
  const value = valueProp ?? generatedId;

  const triggerRef = React.useRef<View | null>(null);

  React.useLayoutEffect(() => {
    const unregisterItem = rootContext.registerItem(value, triggerRef);
    const unregisterTrigger = rootContext.registerTrigger(value, triggerRef);
    return () => {
      unregisterItem();
      unregisterTrigger();
    };
  }, [value, rootContext]);

  const index = rootContext.getItemIndex(value);
  const open = rootContext.openItems.has(value);
  const isDisabled = disabled === true || rootContext.isDisabled;

  React.useEffect(() => {
    if (onOpenChangeProp) {
      onOpenChangeProp(open, { open, value });
    }
  }, [open, value, onOpenChangeProp]);

  const state: AccordionItemState = {
    disabled: isDisabled,
    index,
    open,
    value,
  };

  return {
    isDisabled,
    index,
    open,
    triggerRef,
    value,
    state,
  };
}
