import * as React from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { SliderState, KeyPressEventData } from './types';

export interface SliderContextValue extends SliderState {
  setThumbValue: (index: number, value: number) => void;
  onThumbDragStart: (index: number) => void;
  onThumbDragEnd: () => void;
  onThumbFocus: (index: number) => void;
  onThumbBlur: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
  handlePointerDown: (event: GestureResponderEvent) => void;
  handlePointerMove: (event: GestureResponderEvent) => void;
  handlePointerUp: () => void;
  handleKeyDown: (
    index: number,
    event: NativeSyntheticEvent<KeyPressEventData>,
  ) => void;
}

export const SliderContext = React.createContext<SliderContextValue | null>(
  null,
);

export function useSliderContext(): SliderContextValue {
  const context = React.useContext(SliderContext);
  if (!context) {
    throw new Error('Slider components must be used within a Slider.Root');
  }
  return context;
}
