import { Toggle as ToggleComponent } from './toggle';
import type { ToggleProps, TogglePressedChangeDetails } from './types';
import {
  useToggleGroupContext,
  ToggleGroupContext,
  type ToggleGroupContextValue,
  type ToggleGroupChangeEventDetails,
} from './group-context';

export const Toggle = ToggleComponent;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Toggle {
  export type Props = ToggleProps;
  export type PressedChangeDetails = TogglePressedChangeDetails;

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Group {
    export type ContextValue = ToggleGroupContextValue;
    export type ChangeEventDetails = ToggleGroupChangeEventDetails;
  }
}

export type { ToggleProps, TogglePressedChangeDetails };
export { useToggleGroupContext, ToggleGroupContext };
export type {
  ToggleGroupContextValue,
  ToggleGroupChangeEventDetails,
  Orientation,
} from './group-context';
