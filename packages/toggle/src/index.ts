import { Toggle as ToggleComponent } from './toggle';
import type {
  ToggleProps,
  TogglePressedChangeDetails,
  ToggleState,
} from './types';
import {
  useToggleGroupContext,
  ToggleGroupContext,
  type ToggleGroupContextValue,
  type ToggleGroupChangeEventDetails,
} from './group-context';

export const Toggle = ToggleComponent;

export type {
  ToggleProps as Props,
  TogglePressedChangeDetails as PressedChangeDetails,
  ToggleState as State,
};

export type {
  ToggleGroupContextValue as GroupContextValue,
  ToggleGroupChangeEventDetails as GroupChangeEventDetails,
};

export type { ToggleProps, TogglePressedChangeDetails, ToggleState };
export { useToggleGroupContext, ToggleGroupContext };
export type {
  ToggleGroupContextValue,
  ToggleGroupChangeEventDetails,
  Orientation,
} from './group-context';
