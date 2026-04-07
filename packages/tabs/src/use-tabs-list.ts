import { useTabsContext } from './context';
import type { TabsListState } from './types';

export function useTabsList() {
  const context = useTabsContext();

  const state: TabsListState = {
    activationDirection: context.activationDirection,
    orientation: context.orientation,
  };

  return { state };
}
