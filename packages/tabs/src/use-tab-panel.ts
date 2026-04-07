import * as React from 'react';

import { useTabsContext } from './context';
import type { TabPanelProps, TabPanelState } from './types';

export function useTabPanel(props: TabPanelProps) {
  const { keepMounted = false, value } = props;
  const context = useTabsContext();

  React.useLayoutEffect(() => {
    return context.registerPanel(value);
  }, [value, context]);

  const active = context.value === value;
  const index = context.getTabIndex(value);

  const state: TabPanelState = {
    activationDirection: context.activationDirection,
    hidden: !active,
    index,
    orientation: context.orientation,
  };

  const shouldRender = active || keepMounted;

  return { shouldRender, state };
}
