import * as React from 'react';
import type { SliderState } from './types';

interface SliderContextValue {
  state: SliderState;
  setValueAtIndex: (index: number, next: number) => void;
  stepBy: (index: number, delta: number) => void;
}

export const SliderContext = React.createContext<SliderContextValue | null>(
  null,
);

export function useSliderContext() {
  const context = React.useContext(SliderContext);
  if (!context) {
    throw new Error('Slider components must be used within <Slider.Root>.');
  }
  return context;
}
