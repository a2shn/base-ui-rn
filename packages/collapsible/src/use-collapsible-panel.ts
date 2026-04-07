import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { useCollapsibleContext } from './context';
import type { CollapsiblePanelProps, CollapsiblePanelState } from './types';

export function useCollapsiblePanel(props: CollapsiblePanelProps) {
  const { hiddenUntilFound = false, keepMounted = false } = props;
  const context = useCollapsibleContext();

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

  const shouldRender = keepMounted || hiddenUntilFound || context.open;

  const state: CollapsiblePanelState = {
    disabled: context.disabled,
    open: context.open,
    panel: {
      height: contentHeight,
      width: contentWidth,
    },
  };

  return {
    isDisabled: context.disabled,
    handleOnLayout,
    open: context.open,
    shouldRender,
    state,
  };
}
