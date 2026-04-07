import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { useAccordionContext, useAccordionItemContext } from './context';
import type { AccordionPanelProps, AccordionPanelState } from './types';

export function useAccordionPanel(props: AccordionPanelProps) {
  const { hiddenUntilFound = false, keepMounted = false } = props;

  const rootContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const [contentHeight, setContentHeight] = React.useState<number | undefined>(
    undefined,
  );
  const [contentWidth, setContentWidth] = React.useState<number | undefined>(
    undefined,
  );

  const handleOnLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setContentHeight(height);
    setContentWidth(width);
  }, []);

  const shouldRender = keepMounted || hiddenUntilFound || itemContext.open;

  const state: AccordionPanelState = {
    disabled: itemContext.isDisabled,
    index: itemContext.index,
    open: itemContext.open,
    panel: {
      height: contentHeight,
      width: contentWidth,
    },
  };

  return {
    isDisabled: itemContext.isDisabled,
    index: itemContext.index,
    handleOnLayout,
    open: itemContext.open,
    orientation: rootContext.orientation,
    shouldRender,
    state,
  };
}
