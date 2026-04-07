import { useTabsContext } from './context';
import type { TabsIndicatorState } from './types';

export function useTabsIndicator() {
  const context = useTabsContext();
  const activeMeasurement =
    context.value !== null ? context.tabMeasurements.get(context.value) : null;

  const state: TabsIndicatorState = {
    activationDirection: context.activationDirection,
    orientation: context.orientation,
    tab: {
      height: activeMeasurement?.height,
      left: activeMeasurement?.x,
      top: activeMeasurement?.y,
      width: activeMeasurement?.width,
    },
  };

  return { state };
}
