import * as React from 'react';
import {
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type GestureResponderHandlers,
  type View,
} from 'react-native';
import type { SliderState, KeyPressEventData, ThumbAlignment } from './types';

export interface SliderContextValue extends SliderState {
  setThumbValue: (index: number, value: number) => void;
  onThumbDragStart: (index: number) => void;
  onThumbDragEnd: () => void;
  onThumbFocus: (index: number) => void;
  onThumbBlur: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
  onThumbLayout: (e: LayoutChangeEvent) => void;
  panHandlers: GestureResponderHandlers;
  handleKeyDown: (
    index: number,
    event: NativeSyntheticEvent<KeyPressEventData>,
  ) => void;
  thumbAlignment: ThumbAlignment;
  thumbSize: number;
  controlRef: React.RefObject<View | null>;
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
