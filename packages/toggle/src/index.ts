import {
  type ToggleGroupChangeEventDetails,
  ToggleGroupContext,
  type ToggleGroupContextValue,
  useToggleGroupContext,
} from './group-context';
import { Toggle as ToggleComponent } from './toggle';
import type {
  TogglePressedChangeDetails,
  ToggleProps,
  ToggleState,
} from './types';

export const Toggle = ToggleComponent;

export type {
  TogglePressedChangeDetails as PressedChangeDetails,
  ToggleProps as Props,
  ToggleState as State,
};

export type {
  ToggleGroupChangeEventDetails as GroupChangeEventDetails,
  ToggleGroupContextValue as GroupContextValue,
};

export type { TogglePressedChangeDetails, ToggleProps, ToggleState };
export { ToggleGroupContext, useToggleGroupContext };
export type {
  Orientation,
  ToggleGroupChangeEventDetails,
  ToggleGroupContextValue,
} from './group-context';
